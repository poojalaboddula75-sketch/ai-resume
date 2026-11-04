import React, { useState, useEffect } from 'react';
import { ResumeData } from './types/resume';
import { techResume, blankResume } from './data/sampleResumes';
import { Navbar } from './components/common/Navbar';
import { EditorPanel } from './components/editor/EditorPanel';
import { PreviewPanel } from './components/preview/PreviewPanel';
import { UploadResumeModal } from './components/modals/UploadResumeModal';
import { JobTailorModal } from './components/modals/JobTailorModal';
import { AtsScoreModal } from './components/modals/AtsScoreModal';

const LOCAL_STORAGE_KEY = 'resumai_saved_profile_v1';

export default function App() {
  const [resume, setResume] = useState<ResumeData>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not load resume from storage', e);
    }
    return techResume;
  });

  // Modal open states
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isJobTailorOpen, setIsJobTailorOpen] = useState(false);
  const [isAtsScoreOpen, setIsAtsScoreOpen] = useState(false);

  // Mobile active pane switch ('edit' | 'preview')
  const [mobilePane, setMobilePane] = useState<'edit' | 'preview'>('edit');

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(resume));
    } catch (e) {
      console.warn('Could not persist resume', e);
    }
  }, [resume]);

  // Handle parsed resume import
  const handleApplyParsedData = (data: Partial<ResumeData>, mode: 'replace' | 'merge') => {
    if (mode === 'replace') {
      setResume((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          ...(data.personalInfo || {}),
        },
        experiences: data.experiences && data.experiences.length > 0 ? data.experiences : prev.experiences,
        education: data.education && data.education.length > 0 ? data.education : prev.education,
        skills: data.skills && data.skills.length > 0 ? data.skills : prev.skills,
        projects: data.projects && data.projects.length > 0 ? data.projects : prev.projects,
        certifications: data.certifications && data.certifications.length > 0 ? data.certifications : prev.certifications,
        languages: data.languages && data.languages.length > 0 ? data.languages : prev.languages,
      }));
    } else {
      // Merge mode
      setResume((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          ...(data.personalInfo || {}),
        },
        experiences: [...(data.experiences || []), ...prev.experiences],
        education: [...(data.education || []), ...prev.education],
        skills: [...prev.skills, ...(data.skills || [])],
        projects: [...(data.projects || []), ...prev.projects],
        certifications: [...prev.certifications, ...(data.certifications || [])],
        languages: [...prev.languages, ...(data.languages || [])],
      }));
    }
  };

  // Handle tailored summary replacement
  const handleApplySummary = (newSummary: string) => {
    setResume((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        summary: newSummary,
      },
    }));
  };

  // Handle bullet rewrite
  const handleApplyBulletRewrite = (role: string, original: string, suggested: string) => {
    setResume((prev) => {
      const updatedExperiences = prev.experiences.map((exp) => {
        const bullets = exp.bullets.map((b) => (b === original ? suggested : b));
        return { ...exp, bullets };
      });
      return { ...prev, experiences: updatedExperiences };
    });
  };

  // Handle adding missing keywords to skills
  const handleAddSkills = (skillsToAdd: string[]) => {
    setResume((prev) => {
      const skills = [...prev.skills];
      if (skills.length === 0) {
        skills.push({ category: 'Key Technical Competencies', items: skillsToAdd });
      } else {
        // Add to first category without duplicates
        const existing = new Set(skills[0].items);
        skillsToAdd.forEach((s) => existing.add(s));
        skills[0] = { ...skills[0], items: Array.from(existing) };
      }
      return { ...prev, skills };
    });
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Navigation */}
      <Navbar
        resume={resume}
        onSelectSample={(sample) => setResume(sample)}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenJobTailor={() => setIsJobTailorOpen(true)}
        onOpenAtsScore={() => setIsAtsScoreOpen(true)}
        onResetResume={() => setResume(blankResume)}
        onImportJson={(imported) => setResume(imported)}
      />

      {/* Mobile pane switcher (no-print) */}
      <div className="no-print lg:hidden flex border-b border-slate-800 bg-slate-900 px-4 py-2 gap-2 shrink-0">
        <button
          onClick={() => setMobilePane('edit')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
            mobilePane === 'edit'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-800 text-slate-300'
          }`}
        >
          Form & AI Editor
        </button>
        <button
          onClick={() => setMobilePane('preview')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
            mobilePane === 'preview'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-800 text-slate-300'
          }`}
        >
          Live Resume & PDF
        </button>
      </div>

      {/* Main Split Screen Studio */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Editor & AI Controls */}
        <div
          className={`w-full lg:w-[48%] xl:w-[44%] h-full ${
            mobilePane === 'edit' ? 'block' : 'hidden lg:block'
          } no-print`}
        >
          <EditorPanel
            resume={resume}
            onChange={(updated) => setResume(updated)}
            onOpenJobTailor={() => setIsJobTailorOpen(true)}
            onOpenAtsScore={() => setIsAtsScoreOpen(true)}
          />
        </div>

        {/* Right Panel: Live Canvas & PDF Preview */}
        <div
          className={`flex-1 h-full ${
            mobilePane === 'preview' ? 'block' : 'hidden lg:block'
          }`}
        >
          <PreviewPanel
            resume={resume}
            onOpenUpload={() => setIsUploadOpen(true)}
            onOpenJobTailor={() => setIsJobTailorOpen(true)}
          />
        </div>
      </div>

      {/* Modals */}
      <UploadResumeModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onApplyParsedData={handleApplyParsedData}
      />

      <JobTailorModal
        isOpen={isJobTailorOpen}
        onClose={() => setIsJobTailorOpen(false)}
        resume={resume}
        onApplySummary={handleApplySummary}
        onApplyBulletRewrite={handleApplyBulletRewrite}
        onAddSkills={handleAddSkills}
      />

      <AtsScoreModal
        isOpen={isAtsScoreOpen}
        onClose={() => setIsAtsScoreOpen(false)}
        resume={resume}
      />
    </div>
  );
}
