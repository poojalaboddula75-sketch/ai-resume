import React, { useState } from 'react';
import { 
  ResumeData, TemplateId, FontFamily, MarginsSize, FontSize,
  ExperienceItem, EducationItem, SkillCategory, ProjectItem, CertificationItem, LanguageItem, CustomSection 
} from '../../types/resume';
import { 
  User, Briefcase, GraduationCap, Code, FolderGit2, Award, 
  Globe, Plus, Trash2, ChevronDown, ChevronUp, Sparkles, 
  Palette, Layout, Sliders, Check, Eye, EyeOff, GripVertical, 
  FileText, ArrowUp, ArrowDown, Loader2, Bot, Target, ShieldCheck 
} from 'lucide-react';
import { AiBulletEnhanceModal } from '../modals/AiBulletEnhanceModal';

interface EditorPanelProps {
  resume: ResumeData;
  onChange: (updated: ResumeData) => void;
  onOpenJobTailor: () => void;
  onOpenAtsScore: () => void;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  resume,
  onChange,
  onOpenJobTailor,
  onOpenAtsScore,
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'ai'>('content');
  const [openSection, setOpenSection] = useState<string>('personal');
  
  // State for AI Bullet Enhance Modal
  const [bulletModal, setBulletModal] = useState<{
    isOpen: boolean;
    bullet: string;
    role?: string;
    company?: string;
    onApply: (newBullet: string) => void;
  }>({
    isOpen: false,
    bullet: '',
    onApply: () => {},
  });

  // State for AI Summary Generator
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryOptions, setSummaryOptions] = useState<Array<{ label: string; text: string }>>([]);

  // State for AI Skill Suggestions
  const [isSuggestingSkills, setIsSuggestingSkills] = useState(false);
  const [suggestedSkills, setSuggestedSkills] = useState<Array<{ category: string; skills: string[] }>>([]);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? '' : section);
  };

  // Helper updates
  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], val: string) => {
    onChange({
      ...resume,
      personalInfo: {
        ...resume.personalInfo,
        [field]: val,
      },
    });
  };

  // Generate AI Summaries
  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const response = await fetch('/api/ai/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: resume.personalInfo.fullName,
          jobTitle: resume.personalInfo.jobTitle,
          experiences: resume.experiences,
          skills: resume.skills.flatMap((s) => s.items),
        }),
      });
      const data = await response.json();
      if (data.success && data.data) {
        setSummaryOptions(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // Fetch AI Skill Suggestions
  const handleSuggestSkills = async () => {
    setIsSuggestingSkills(true);
    try {
      const response = await fetch('/api/ai/suggest-skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: resume.personalInfo.jobTitle || 'Software Engineer',
          existingSkills: resume.skills.flatMap((s) => s.items),
        }),
      });
      const data = await response.json();
      if (data.success && data.data) {
        setSuggestedSkills(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSuggestingSkills(false);
    }
  };

  const addSkillToCategory = (catIndex: number, skillName: string) => {
    if (!skillName.trim()) return;
    const updated = [...resume.skills];
    if (!updated[catIndex].items.includes(skillName.trim())) {
      updated[catIndex].items.push(skillName.trim());
      onChange({ ...resume, skills: updated });
    }
  };

  const removeSkillFromCategory = (catIndex: number, skillIdx: number) => {
    const updated = [...resume.skills];
    updated[catIndex].items.splice(skillIdx, 1);
    onChange({ ...resume, skills: updated });
  };

  // Experience handlers
  const addExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      bullets: ['Led cross-functional initiatives and delivered measurable business results.'],
    };
    onChange({
      ...resume,
      experiences: [newExp, ...resume.experiences],
    });
    setOpenSection('experience');
  };

  const updateExperience = (index: number, updatedExp: ExperienceItem) => {
    const list = [...resume.experiences];
    list[index] = updatedExp;
    onChange({ ...resume, experiences: list });
  };

  const deleteExperience = (index: number) => {
    const list = [...resume.experiences];
    list.splice(index, 1);
    onChange({ ...resume, experiences: list });
  };

  // Education handlers
  const addEducation = () => {
    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      school: '',
      degree: '',
      fieldOfStudy: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      highlights: [],
    };
    onChange({
      ...resume,
      education: [newEdu, ...resume.education],
    });
    setOpenSection('education');
  };

  const updateEducation = (index: number, updatedEdu: EducationItem) => {
    const list = [...resume.education];
    list[index] = updatedEdu;
    onChange({ ...resume, education: list });
  };

  const deleteEducation = (index: number) => {
    const list = [...resume.education];
    list.splice(index, 1);
    onChange({ ...resume, education: list });
  };

  // Project handlers
  const addProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: '',
      description: '',
      role: '',
      technologies: [],
      link: '',
      github: '',
      bullets: ['Built full-stack application with automated testing and deployment.'],
    };
    onChange({
      ...resume,
      projects: [newProj, ...resume.projects],
    });
    setOpenSection('projects');
  };

  const updateProject = (index: number, updatedProj: ProjectItem) => {
    const list = [...resume.projects];
    list[index] = updatedProj;
    onChange({ ...resume, projects: list });
  };

  const deleteProject = (index: number) => {
    const list = [...resume.projects];
    list.splice(index, 1);
    onChange({ ...resume, projects: list });
  };

  // Certifications
  const addCertification = () => {
    const newCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialUrl: '',
    };
    onChange({
      ...resume,
      certifications: [...resume.certifications, newCert],
    });
    setOpenSection('certifications');
  };

  // Languages
  const addLanguage = () => {
    const newLang: LanguageItem = {
      language: '',
      proficiency: 'Professional Working',
    };
    onChange({
      ...resume,
      languages: [...resume.languages, newLang],
    });
  };

  // Preset Colors
  const colorPresets = [
    { name: 'Royal Blue', hex: '#2563eb' },
    { name: 'Deep Indigo', hex: '#4f46e5' },
    { name: 'Emerald', hex: '#059669' },
    { name: 'Slate Dark', hex: '#0f172a' },
    { name: 'Ruby Rose', hex: '#e11d48' },
    { name: 'Amber Bronze', hex: '#d97706' },
    { name: 'Violet Purple', hex: '#7c3aed' },
    { name: 'Teal Cyan', hex: '#0891b2' },
  ];

  const templatesList: Array<{ id: TemplateId; name: string; desc: string; badge?: string }> = [
    { id: 'modern', name: 'Modern Clean', desc: 'Balanced accent bar with sleek grid contact details', badge: 'Popular' },
    { id: 'minimalist', name: 'ATS Standard', desc: '100% ATS parser compliant single-column format', badge: 'Top ATS' },
    { id: 'executive', name: 'Executive Serif', desc: 'Distinguished typography for director & leadership roles' },
    { id: 'tech', name: 'Tech & Code', desc: 'Engineered for developers with monospace accents' },
    { id: 'twocolumn', name: 'Two-Column Compact', desc: 'Space-saving layout fitting max content into 1 page' },
    { id: 'creative', name: 'Creative Accent', desc: 'Header banner gradient for marketing & design roles' },
  ];

  return (
    <div className="h-full flex flex-col bg-slate-900 border-r border-slate-800 text-slate-100 select-none">
      {/* Top Tab Bar */}
      <div className="flex border-b border-slate-800 bg-slate-950/70 p-1.5 gap-1 shrink-0">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
            activeTab === 'content'
              ? 'bg-slate-800 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Content
        </button>
        <button
          onClick={() => setActiveTab('design')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
            activeTab === 'design'
              ? 'bg-slate-800 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          Templates & Style
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
            activeTab === 'ai'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/30'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          AI Studio
        </button>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ================= TAB 1: CONTENT ================= */}
        {activeTab === 'content' && (
          <div className="space-y-3">
            {/* Quick AI Action Callout Banner */}
            <div className="p-3 rounded-xl bg-linear-to-r from-indigo-900/40 via-purple-900/30 to-blue-900/40 border border-indigo-500/30 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-xs text-indigo-200 font-medium">
                  Boost your resume with AI job tailoring & ATS scoring
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={onOpenJobTailor}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition"
                >
                  Tailor to Job
                </button>
              </div>
            </div>

            {/* 1. PERSONAL INFORMATION */}
            <div className="border border-slate-800 bg-slate-950/40 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('personal')}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-850/50 transition text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-400">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">Contact & Personal Details</span>
                    <p className="text-[11px] text-slate-400">
                      {resume.personalInfo.fullName || 'Name, title, email, phone, links'}
                    </p>
                  </div>
                </div>
                {openSection === 'personal' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {openSection === 'personal' && (
                <div className="p-4 border-t border-slate-800/80 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={resume.personalInfo.fullName}
                        onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                        placeholder="e.g. Alex Morgan"
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">Target / Current Job Title</label>
                      <input
                        type="text"
                        value={resume.personalInfo.jobTitle}
                        onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)}
                        placeholder="e.g. Senior Software Architect"
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">Email</label>
                      <input
                        type="email"
                        value={resume.personalInfo.email}
                        onChange={(e) => updatePersonalInfo('email', e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={resume.personalInfo.phone}
                        onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">Location</label>
                      <input
                        type="text"
                        value={resume.personalInfo.location}
                        onChange={(e) => updatePersonalInfo('location', e.target.value)}
                        placeholder="City, State / Country"
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">Portfolio / Website</label>
                      <input
                        type="text"
                        value={resume.personalInfo.website}
                        onChange={(e) => updatePersonalInfo('website', e.target.value)}
                        placeholder="https://yourname.dev"
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">LinkedIn Profile</label>
                      <input
                        type="text"
                        value={resume.personalInfo.linkedin}
                        onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                        placeholder="linkedin.com/in/username"
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">GitHub / Code Link</label>
                      <input
                        type="text"
                        value={resume.personalInfo.github}
                        onChange={(e) => updatePersonalInfo('github', e.target.value)}
                        placeholder="github.com/username"
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. PROFESSIONAL SUMMARY */}
            <div className="border border-slate-800 bg-slate-950/40 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('summary')}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-850/50 transition text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">Professional Summary</span>
                    <p className="text-[11px] text-slate-400">High-impact 3-4 sentence elevator pitch</p>
                  </div>
                </div>
                {openSection === 'summary' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {openSection === 'summary' && (
                <div className="p-4 border-t border-slate-800/80 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-slate-400">
                      Craft an impactful summary tailored to your strengths
                    </span>
                    <button
                      type="button"
                      onClick={handleGenerateSummary}
                      disabled={isGeneratingSummary}
                      className="px-2.5 py-1 text-[11px] font-semibold text-indigo-300 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 rounded-md flex items-center gap-1.5 transition"
                    >
                      {isGeneratingSummary ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                      )}
                      Generate with AI
                    </button>
                  </div>

                  <textarea
                    value={resume.personalInfo.summary}
                    onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                    rows={4}
                    placeholder="Results-driven professional with 5+ years driving quantifiable outcomes..."
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-purple-500"
                  />

                  {/* AI Generated Summary choices */}
                  {summaryOptions.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
                        AI Generated Options (Click to use):
                      </span>
                      {summaryOptions.map((opt, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            updatePersonalInfo('summary', opt.text);
                            setSummaryOptions([]);
                          }}
                          className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition text-xs space-y-1"
                        >
                          <div className="font-semibold text-indigo-400 text-[11px]">{opt.label}</div>
                          <div className="text-slate-300">{opt.text}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 3. WORK EXPERIENCE */}
            <div className="border border-slate-800 bg-slate-950/40 rounded-xl overflow-hidden">
              <div className="p-3.5 flex items-center justify-between hover:bg-slate-850/50 transition">
                <button
                  type="button"
                  onClick={() => toggleSection('experience')}
                  className="flex items-center gap-2.5 text-left flex-1"
                >
                  <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">
                      Work Experience ({resume.experiences.length})
                    </span>
                    <p className="text-[11px] text-slate-400">Roles, achievements & STAR metric bullets</p>
                  </div>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={addExperience}
                    className="px-2 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded flex items-center gap-1 transition"
                  >
                    <Plus className="w-3 h-3" /> Add Role
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleSection('experience')}
                    className="text-slate-400 hover:text-white p-1"
                  >
                    {openSection === 'experience' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {openSection === 'experience' && (
                <div className="p-4 border-t border-slate-800/80 space-y-4">
                  {resume.experiences.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs">
                      No work experiences added yet.{' '}
                      <button
                        onClick={addExperience}
                        className="text-emerald-400 underline ml-1"
                      >
                        Add your first role
                      </button>
                    </div>
                  ) : (
                    resume.experiences.map((exp, expIdx) => (
                      <div
                        key={exp.id || expIdx}
                        className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <span className="text-xs font-bold text-slate-200">
                            {exp.role || 'New Role'} {exp.company ? `@ ${exp.company}` : ''}
                          </span>
                          <button
                            type="button"
                            onClick={() => deleteExperience(expIdx)}
                            className="text-slate-400 hover:text-rose-400 p-1 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[10px] font-medium text-slate-400 mb-0.5">Role / Title</label>
                            <input
                              type="text"
                              value={exp.role}
                              onChange={(e) => updateExperience(expIdx, { ...exp, role: e.target.value })}
                              placeholder="e.g. Lead Software Engineer"
                              className="w-full bg-slate-950 border border-slate-700/80 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-hidden focus:border-emerald-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-medium text-slate-400 mb-0.5">Company / Organization</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => updateExperience(expIdx, { ...exp, company: e.target.value })}
                              placeholder="e.g. Google / Stripe"
                              className="w-full bg-slate-950 border border-slate-700/80 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-hidden focus:border-emerald-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div>
                            <label className="block text-[10px] font-medium text-slate-400 mb-0.5">Location</label>
                            <input
                              type="text"
                              value={exp.location}
                              onChange={(e) => updateExperience(expIdx, { ...exp, location: e.target.value })}
                              placeholder="e.g. San Francisco, CA / Remote"
                              className="w-full bg-slate-950 border border-slate-700/80 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-hidden focus:border-emerald-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-medium text-slate-400 mb-0.5">Start Date</label>
                            <input
                              type="text"
                              value={exp.startDate}
                              onChange={(e) => updateExperience(expIdx, { ...exp, startDate: e.target.value })}
                              placeholder="e.g. 2021-03 or Jan 2021"
                              className="w-full bg-slate-950 border border-slate-700/80 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-hidden focus:border-emerald-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-medium text-slate-400 mb-0.5">End Date</label>
                            <input
                              type="text"
                              value={exp.current ? 'Present' : exp.endDate}
                              disabled={exp.current}
                              onChange={(e) => updateExperience(expIdx, { ...exp, endDate: e.target.value })}
                              placeholder="e.g. Present or 2023-09"
                              className="w-full bg-slate-950 border border-slate-700/80 rounded px-2.5 py-1.5 text-xs text-slate-100 disabled:opacity-50 focus:outline-hidden focus:border-emerald-500"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={exp.current}
                              onChange={(e) => updateExperience(expIdx, { ...exp, current: e.target.checked })}
                              className="rounded bg-slate-900 border-slate-700 text-emerald-600 focus:ring-0"
                            />
                            <span>I currently work in this role</span>
                          </label>
                        </div>

                        {/* Experience Bullets */}
                        <div className="space-y-2 pt-2 border-t border-slate-800">
                          <div className="flex justify-between items-center">
                            <span className="text-[11px] font-semibold text-slate-400">
                              Accomplishments & Bullets
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const bullets = [...(exp.bullets || []), ''];
                                updateExperience(expIdx, { ...exp, bullets });
                              }}
                              className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" /> Add Bullet
                            </button>
                          </div>

                          {exp.bullets.map((bullet, bulletIdx) => (
                            <div key={bulletIdx} className="flex items-start gap-1.5 group">
                              <span className="text-slate-500 text-xs mt-2 select-none">•</span>
                              <textarea
                                value={bullet}
                                onChange={(e) => {
                                  const bullets = [...exp.bullets];
                                  bullets[bulletIdx] = e.target.value;
                                  updateExperience(expIdx, { ...exp, bullets });
                                }}
                                rows={2}
                                placeholder="Accomplished [X] as measured by [Y] by doing [Z]..."
                                className="flex-1 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded p-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden"
                              />
                              <div className="flex flex-col gap-1 pt-1 shrink-0">
                                <button
                                  type="button"
                                  title="Enhance with AI"
                                  onClick={() => {
                                    setBulletModal({
                                      isOpen: true,
                                      bullet,
                                      role: exp.role,
                                      company: exp.company,
                                      onApply: (newBullet) => {
                                        const bullets = [...exp.bullets];
                                        bullets[bulletIdx] = newBullet;
                                        updateExperience(expIdx, { ...exp, bullets });
                                      },
                                    });
                                  }}
                                  className="p-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition"
                                >
                                  <Sparkles className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const bullets = [...exp.bullets];
                                    bullets.splice(bulletIdx, 1);
                                    updateExperience(expIdx, { ...exp, bullets });
                                  }}
                                  className="p-1 rounded hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* 4. SKILLS & KEYWORDS */}
            <div className="border border-slate-800 bg-slate-950/40 rounded-xl overflow-hidden">
              <div className="p-3.5 flex items-center justify-between hover:bg-slate-850/50 transition">
                <button
                  type="button"
                  onClick={() => toggleSection('skills')}
                  className="flex items-center gap-2.5 text-left flex-1"
                >
                  <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-400">
                    <Code className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">Skills & ATS Keywords</span>
                    <p className="text-[11px] text-slate-400">Categorized competencies & technologies</p>
                  </div>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSuggestSkills}
                    disabled={isSuggestingSkills}
                    className="px-2 py-1 text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded flex items-center gap-1 transition"
                  >
                    {isSuggestingSkills ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    AI Suggest
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleSection('skills')}
                    className="text-slate-400 hover:text-white p-1"
                  >
                    {openSection === 'skills' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {openSection === 'skills' && (
                <div className="p-4 border-t border-slate-800/80 space-y-4">
                  {/* AI Suggested Skills Banner */}
                  {suggestedSkills.length > 0 && (
                    <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
                      <div className="text-[11px] font-bold text-indigo-300 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                        AI In-Demand Recommendations for "{resume.personalInfo.jobTitle || 'Role'}"
                      </div>
                      <div className="space-y-2">
                        {suggestedSkills.map((cat, cIdx) => (
                          <div key={cIdx} className="space-y-1">
                            <span className="text-[10px] font-semibold text-slate-400">{cat.category}</span>
                            <div className="flex flex-wrap gap-1">
                              {cat.skills.map((sk, sIdx) => (
                                <button
                                  key={sIdx}
                                  type="button"
                                  onClick={() => addSkillToCategory(0, sk)}
                                  className="text-[11px] px-2 py-0.5 rounded bg-slate-900 hover:bg-indigo-600 text-slate-300 hover:text-white border border-slate-700 transition flex items-center gap-1"
                                >
                                  <Plus className="w-2.5 h-2.5" />
                                  {sk}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {resume.skills.map((skillGroup, catIdx) => (
                    <div key={catIdx} className="p-3 rounded-lg border border-slate-800 bg-slate-900/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={skillGroup.category}
                          onChange={(e) => {
                            const updated = [...resume.skills];
                            updated[catIdx].category = e.target.value;
                            onChange({ ...resume, skills: updated });
                          }}
                          placeholder="Category Name"
                          className="bg-transparent border-b border-transparent focus:border-amber-500 font-semibold text-xs text-slate-200 focus:outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...resume.skills];
                            updated.splice(catIdx, 1);
                            onChange({ ...resume, skills: updated });
                          }}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Chips */}
                      <div className="flex flex-wrap gap-1.5">
                        {skillGroup.items.map((item, itemIdx) => (
                          <span
                            key={itemIdx}
                            className="text-xs px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200 flex items-center gap-1.5"
                          >
                            <span>{item}</span>
                            <button
                              type="button"
                              onClick={() => removeSkillFromCategory(catIdx, itemIdx)}
                              className="text-slate-400 hover:text-rose-400"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>

                      {/* Add skill input */}
                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          placeholder="Type a skill and press Enter..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const input = e.currentTarget;
                              addSkillToCategory(catIdx, input.value);
                              input.value = '';
                            }
                          }}
                          className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-hidden focus:border-amber-500"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      const newCat: SkillCategory = { category: 'New Skill Group', items: [] };
                      onChange({ ...resume, skills: [...resume.skills, newCat] });
                    }}
                    className="w-full py-2 text-xs text-slate-400 hover:text-white border border-dashed border-slate-700 hover:border-slate-500 rounded-lg flex items-center justify-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Skill Category
                  </button>
                </div>
              )}
            </div>

            {/* 5. EDUCATION */}
            <div className="border border-slate-800 bg-slate-950/40 rounded-xl overflow-hidden">
              <div className="p-3.5 flex items-center justify-between hover:bg-slate-850/50 transition">
                <button
                  type="button"
                  onClick={() => toggleSection('education')}
                  className="flex items-center gap-2.5 text-left flex-1"
                >
                  <div className="p-1.5 rounded-md bg-cyan-500/10 text-cyan-400">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">
                      Education ({resume.education.length})
                    </span>
                    <p className="text-[11px] text-slate-400">Degrees, universities, honors & GPA</p>
                  </div>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={addEducation}
                    className="px-2 py-1 text-[11px] font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded flex items-center gap-1 transition"
                  >
                    <Plus className="w-3 h-3" /> Add Degree
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleSection('education')}
                    className="text-slate-400 hover:text-white p-1"
                  >
                    {openSection === 'education' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {openSection === 'education' && (
                <div className="p-4 border-t border-slate-800/80 space-y-4">
                  {resume.education.map((edu, eduIdx) => (
                    <div key={edu.id || eduIdx} className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
                      <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                        <span className="text-xs font-bold text-slate-200">
                          {edu.degree || 'Degree'} {edu.school ? `@ ${edu.school}` : ''}
                        </span>
                        <button
                          type="button"
                          onClick={() => deleteEducation(eduIdx)}
                          className="text-slate-400 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-medium text-slate-400 mb-0.5">School / Institution</label>
                          <input
                            type="text"
                            value={edu.school}
                            onChange={(e) => updateEducation(eduIdx, { ...edu, school: e.target.value })}
                            placeholder="e.g. UC Berkeley"
                            className="w-full bg-slate-950 border border-slate-700/80 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-hidden focus:border-cyan-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-slate-400 mb-0.5">Degree & Major</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => updateEducation(eduIdx, { ...edu, degree: e.target.value })}
                            placeholder="e.g. B.S. in Computer Science"
                            className="w-full bg-slate-950 border border-slate-700/80 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-hidden focus:border-cyan-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-medium text-slate-400 mb-0.5">Location</label>
                          <input
                            type="text"
                            value={edu.location}
                            onChange={(e) => updateEducation(eduIdx, { ...edu, location: e.target.value })}
                            placeholder="e.g. Berkeley, CA"
                            className="w-full bg-slate-950 border border-slate-700/80 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-hidden focus:border-cyan-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-slate-400 mb-0.5">Graduation / Date</label>
                          <input
                            type="text"
                            value={edu.endDate}
                            onChange={(e) => updateEducation(eduIdx, { ...edu, endDate: e.target.value })}
                            placeholder="e.g. 2020"
                            className="w-full bg-slate-950 border border-slate-700/80 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-hidden focus:border-cyan-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-slate-400 mb-0.5">GPA (Optional)</label>
                          <input
                            type="text"
                            value={edu.gpa}
                            onChange={(e) => updateEducation(eduIdx, { ...edu, gpa: e.target.value })}
                            placeholder="e.g. 3.85 / 4.0"
                            className="w-full bg-slate-950 border border-slate-700/80 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-hidden focus:border-cyan-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 6. PROJECTS */}
            <div className="border border-slate-800 bg-slate-950/40 rounded-xl overflow-hidden">
              <div className="p-3.5 flex items-center justify-between hover:bg-slate-850/50 transition">
                <button
                  type="button"
                  onClick={() => toggleSection('projects')}
                  className="flex items-center gap-2.5 text-left flex-1"
                >
                  <div className="p-1.5 rounded-md bg-pink-500/10 text-pink-400">
                    <FolderGit2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">
                      Featured Projects ({resume.projects.length})
                    </span>
                    <p className="text-[11px] text-slate-400">Portfolio, demos, tools & open-source</p>
                  </div>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={addProject}
                    className="px-2 py-1 text-[11px] font-semibold bg-pink-600 hover:bg-pink-500 text-white rounded flex items-center gap-1 transition"
                  >
                    <Plus className="w-3 h-3" /> Add Project
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleSection('projects')}
                    className="text-slate-400 hover:text-white p-1"
                  >
                    {openSection === 'projects' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {openSection === 'projects' && (
                <div className="p-4 border-t border-slate-800/80 space-y-4">
                  {resume.projects.map((proj, projIdx) => (
                    <div key={proj.id || projIdx} className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
                      <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                        <span className="text-xs font-bold text-slate-200">{proj.name || 'Project Name'}</span>
                        <button
                          type="button"
                          onClick={() => deleteProject(projIdx)}
                          className="text-slate-400 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-medium text-slate-400 mb-0.5">Project Name</label>
                          <input
                            type="text"
                            value={proj.name}
                            onChange={(e) => updateProject(projIdx, { ...proj, name: e.target.value })}
                            placeholder="e.g. Distributed Analytics Engine"
                            className="w-full bg-slate-950 border border-slate-700/80 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-hidden focus:border-pink-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-slate-400 mb-0.5">Technologies (comma separated)</label>
                          <input
                            type="text"
                            value={proj.technologies.join(', ')}
                            onChange={(e) => {
                              const techs = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                              updateProject(projIdx, { ...proj, technologies: techs });
                            }}
                            placeholder="e.g. React, TypeScript, Go, Docker"
                            className="w-full bg-slate-950 border border-slate-700/80 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-hidden focus:border-pink-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-medium text-slate-400 mb-0.5">Live Demo Link</label>
                          <input
                            type="text"
                            value={proj.link}
                            onChange={(e) => updateProject(projIdx, { ...proj, link: e.target.value })}
                            placeholder="https://..."
                            className="w-full bg-slate-950 border border-slate-700/80 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-hidden focus:border-pink-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-slate-400 mb-0.5">GitHub Repository</label>
                          <input
                            type="text"
                            value={proj.github}
                            onChange={(e) => updateProject(projIdx, { ...proj, github: e.target.value })}
                            placeholder="github.com/..."
                            className="w-full bg-slate-950 border border-slate-700/80 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-hidden focus:border-pink-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 7. CERTIFICATIONS & LANGUAGES */}
            <div className="border border-slate-800 bg-slate-950/40 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('credentials')}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-850/50 transition text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md bg-rose-500/10 text-rose-400">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">Certifications & Languages</span>
                    <p className="text-[11px] text-slate-400">AWS, CKA, PMP, bilingual proficiencies</p>
                  </div>
                </div>
                {openSection === 'credentials' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {openSection === 'credentials' && (
                <div className="p-4 border-t border-slate-800/80 space-y-4">
                  {/* Certifications list */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-300">Certifications</span>
                      <button
                        type="button"
                        onClick={addCertification}
                        className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Certification
                      </button>
                    </div>

                    {resume.certifications.map((cert, cIdx) => (
                      <div key={cIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) => {
                            const updated = [...resume.certifications];
                            updated[cIdx].name = e.target.value;
                            onChange({ ...resume, certifications: updated });
                          }}
                          placeholder="Certification name (e.g. AWS Solutions Architect)"
                          className="flex-2 bg-slate-950 border border-slate-700/80 rounded px-2.5 py-1.5 text-xs text-slate-100"
                        />
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => {
                            const updated = [...resume.certifications];
                            updated[cIdx].issuer = e.target.value;
                            onChange({ ...resume, certifications: updated });
                          }}
                          placeholder="Issuer (e.g. AWS)"
                          className="flex-1 bg-slate-950 border border-slate-700/80 rounded px-2.5 py-1.5 text-xs text-slate-100"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...resume.certifications];
                            updated.splice(cIdx, 1);
                            onChange({ ...resume, certifications: updated });
                          }}
                          className="p-1 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Languages list */}
                  <div className="space-y-2 pt-3 border-t border-slate-800">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-300">Languages</span>
                      <button
                        type="button"
                        onClick={addLanguage}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Language
                      </button>
                    </div>

                    {resume.languages.map((lang, lIdx) => (
                      <div key={lIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={lang.language}
                          onChange={(e) => {
                            const updated = [...resume.languages];
                            updated[lIdx].language = e.target.value;
                            onChange({ ...resume, languages: updated });
                          }}
                          placeholder="e.g. English, Spanish, German"
                          className="flex-1 bg-slate-950 border border-slate-700/80 rounded px-2.5 py-1.5 text-xs text-slate-100"
                        />
                        <select
                          value={lang.proficiency}
                          onChange={(e) => {
                            const updated = [...resume.languages];
                            updated[lIdx].proficiency = e.target.value;
                            onChange({ ...resume, languages: updated });
                          }}
                          className="bg-slate-950 border border-slate-700/80 rounded px-2.5 py-1.5 text-xs text-slate-100"
                        >
                          <option value="Native / Bilingual">Native / Bilingual</option>
                          <option value="Fluent">Fluent</option>
                          <option value="Professional Working">Professional Working</option>
                          <option value="Conversational">Conversational</option>
                          <option value="Elementary">Elementary</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...resume.languages];
                            updated.splice(lIdx, 1);
                            onChange({ ...resume, languages: updated });
                          }}
                          className="p-1 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: DESIGN & TEMPLATES ================= */}
        {activeTab === 'design' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Template selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                Select Resume Template
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {templatesList.map((tpl) => (
                  <div
                    key={tpl.id}
                    onClick={() => {
                      onChange({
                        ...resume,
                        design: { ...resume.design, template: tpl.id },
                      });
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition text-left flex flex-col justify-between ${
                      resume.design.template === tpl.id
                        ? 'border-indigo-500 bg-indigo-500/10 shadow-sm'
                        : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white">{tpl.name}</span>
                        {tpl.badge && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                            {tpl.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">{tpl.desc}</p>
                    </div>
                    {resume.design.template === tpl.id && (
                      <div className="flex items-center gap-1 text-[11px] text-indigo-400 font-semibold mt-2">
                        <Check className="w-3 h-3" /> Active Template
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Accent Color Palette */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                Accent Color Theme
              </label>
              <div className="flex flex-wrap items-center gap-2.5">
                {colorPresets.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => {
                      onChange({
                        ...resume,
                        design: { ...resume.design, colorTheme: c.hex },
                      });
                    }}
                    title={c.name}
                    className={`w-7 h-7 rounded-full border-2 transition flex items-center justify-center ${
                      resume.design.colorTheme === c.hex
                        ? 'border-white scale-110 shadow-md'
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {resume.design.colorTheme === c.hex && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
                {/* Custom Color Input */}
                <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer ml-2">
                  <input
                    type="color"
                    value={resume.design.colorTheme}
                    onChange={(e) => {
                      onChange({
                        ...resume,
                        design: { ...resume.design, colorTheme: e.target.value },
                      });
                    }}
                    className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                  />
                  <span>Custom</span>
                </label>
              </div>
            </div>

            {/* Typography Selection */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                Typography & Font Family
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'inter', name: 'Inter (Clean Modern)' },
                  { id: 'jakarta', name: 'Plus Jakarta Sans (Sleek)' },
                  { id: 'merriweather', name: 'Merriweather (Classic Serif)' },
                  { id: 'playfair', name: 'Playfair (Distinguished)' },
                  { id: 'code', name: 'Fira Code (Tech Accent)' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      onChange({
                        ...resume,
                        design: { ...resume.design, fontFamily: f.id as FontFamily },
                      });
                    }}
                    className={`p-2.5 rounded-lg border text-left transition ${
                      resume.design.fontFamily === f.id
                        ? 'border-indigo-500 bg-indigo-500/10 text-white font-bold'
                        : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Layout Sizing & Margins */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                  Spacing / Margins
                </label>
                <select
                  value={resume.design.margins}
                  onChange={(e) => {
                    onChange({
                      ...resume,
                      design: { ...resume.design, margins: e.target.value as MarginsSize },
                    });
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                >
                  <option value="compact">Compact (Fit more content)</option>
                  <option value="normal">Normal (Standard balanced)</option>
                  <option value="spacious">Spacious (Executive breathing room)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                  Paper Format
                </label>
                <select
                  value={resume.design.paperSize}
                  onChange={(e) => {
                    onChange({
                      ...resume,
                      design: { ...resume.design, paperSize: e.target.value as 'a4' | 'letter' },
                    });
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                >
                  <option value="a4">A4 (International - 210 x 297mm)</option>
                  <option value="letter">US Letter (8.5 x 11 in)</option>
                </select>
              </div>
            </div>

            {/* Section Visibility & Reordering */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                Section Order & Visibility
              </label>
              <div className="space-y-1.5">
                {resume.design.sectionOrder.map((sectionKey, index) => {
                  const isVisible = resume.design.visibleSections[sectionKey as keyof typeof resume.design.visibleSections];
                  const labels: Record<string, string> = {
                    summary: 'Professional Summary',
                    experience: 'Work Experience',
                    education: 'Education',
                    skills: 'Skills & Keywords',
                    projects: 'Projects',
                    certifications: 'Certifications',
                    languages: 'Languages',
                    custom: 'Custom Sections',
                  };

                  return (
                    <div
                      key={sectionKey}
                      className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-3.5 h-3.5 text-slate-600" />
                        <span className={isVisible ? 'text-slate-200 font-medium' : 'text-slate-500 line-through'}>
                          {labels[sectionKey] || sectionKey}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {/* Move Up */}
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => {
                            const newOrder = [...resume.design.sectionOrder];
                            const temp = newOrder[index - 1];
                            newOrder[index - 1] = newOrder[index];
                            newOrder[index] = temp;
                            onChange({
                              ...resume,
                              design: { ...resume.design, sectionOrder: newOrder },
                            });
                          }}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        {/* Move Down */}
                        <button
                          type="button"
                          disabled={index === resume.design.sectionOrder.length - 1}
                          onClick={() => {
                            const newOrder = [...resume.design.sectionOrder];
                            const temp = newOrder[index + 1];
                            newOrder[index + 1] = newOrder[index];
                            newOrder[index] = temp;
                            onChange({
                              ...resume,
                              design: { ...resume.design, sectionOrder: newOrder },
                            });
                          }}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        {/* Visibility Toggle */}
                        <button
                          type="button"
                          onClick={() => {
                            onChange({
                              ...resume,
                              design: {
                                ...resume.design,
                                visibleSections: {
                                  ...resume.design.visibleSections,
                                  [sectionKey]: !isVisible,
                                },
                              },
                            });
                          }}
                          className={`p-1 rounded ${isVisible ? 'text-indigo-400' : 'text-slate-600'}`}
                        >
                          {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: AI STUDIO ================= */}
        {activeTab === 'ai' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* ATS Audit Banner */}
            <div className="p-4 rounded-xl bg-linear-to-br from-blue-950/60 to-slate-900 border border-blue-500/30 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Full ATS Algorithm Audit</h4>
                  <p className="text-[11px] text-slate-400">
                    Calculates readiness score, keyword density, and formatting flaws
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenAtsScore}
                className="w-full py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition"
              >
                <ShieldCheck className="w-4 h-4" /> Run Comprehensive ATS Scan
              </button>
            </div>

            {/* Target Job Tailoring Banner */}
            <div className="p-4 rounded-xl bg-linear-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/30 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Job Description Matching</h4>
                  <p className="text-[11px] text-slate-400">
                    Paste any job posting to detect missing keywords & generate tailored bullets
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenJobTailor}
                className="w-full py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition"
              >
                <Target className="w-4 h-4" /> Open Job Matcher
              </button>
            </div>

            {/* Quick Tips */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2 text-xs">
              <span className="font-bold text-slate-200">How to get a 95+ ATS Score:</span>
              <ul className="space-y-1.5 text-slate-400">
                <li>• Start every experience bullet with an action verb (e.g. Spearheaded, Engineered).</li>
                <li>• Include quantified outcomes (% improvement, hours saved, dollars generated).</li>
                <li>• Use industry-standard skill names without spelling variations.</li>
                <li>• Select the <strong>ATS Standard</strong> or <strong>Modern Clean</strong> template for high scanner pass rates.</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* AI Bullet Enhance Modal */}
      <AiBulletEnhanceModal
        isOpen={bulletModal.isOpen}
        onClose={() => setBulletModal({ ...bulletModal, isOpen: false })}
        originalBullet={bulletModal.bullet}
        role={bulletModal.role}
        company={bulletModal.company}
        onApplyBullet={bulletModal.onApply}
      />
    </div>
  );
};
