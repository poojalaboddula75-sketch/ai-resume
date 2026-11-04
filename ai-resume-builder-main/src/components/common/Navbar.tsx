import React, { useState } from 'react';
import { 
  Sparkles, Upload, Target, ShieldCheck, Download, 
  RotateCcw, FileText, Check, ChevronDown, FolderOpen, Save 
} from 'lucide-react';
import { ResumeData } from '../../types/resume';
import { techResume, executiveResume, blankResume } from '../../data/sampleResumes';

interface NavbarProps {
  resume: ResumeData;
  onSelectSample: (sample: ResumeData) => void;
  onOpenUpload: () => void;
  onOpenJobTailor: () => void;
  onOpenAtsScore: () => void;
  onResetResume: () => void;
  onImportJson: (data: ResumeData) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  resume,
  onSelectSample,
  onOpenUpload,
  onOpenJobTailor,
  onOpenAtsScore,
  onResetResume,
  onImportJson,
}) => {
  const [sampleDropdownOpen, setSampleDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  // Quick export JSON backup
  const handleExportJson = () => {
    const jsonStr = JSON.stringify(resume, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(resume.personalInfo.fullName || 'resume').replace(/\s+/g, '_')}_data.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMoreDropdownOpen(false);
  };

  const handleJsonFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        onImportJson(parsed);
      } catch (err) {
        alert('Invalid resume JSON backup file.');
      }
    };
    reader.readAsText(file);
    setMoreDropdownOpen(false);
  };

  return (
    <header className="no-print h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 flex items-center justify-between gap-3 shrink-0 z-20">
      {/* Brand logo & tagline */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-indigo-600 via-blue-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-600/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">ResumAI</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PRO Studio
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              ATS-Optimized AI Resume Builder & PDF Studio
            </p>
          </div>
        </div>

        {/* Sample Templates Dropdown */}
        <div className="relative ml-2">
          <button
            type="button"
            onClick={() => setSampleDropdownOpen(!sampleDropdownOpen)}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700/80 flex items-center gap-1.5 transition"
          >
            <span>Examples</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {sampleDropdownOpen && (
            <div className="absolute left-0 mt-1.5 w-60 bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Load Sample Career
              </div>
              <button
                type="button"
                onClick={() => {
                  onSelectSample(techResume);
                  setSampleDropdownOpen(false);
                }}
                className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition flex flex-col"
              >
                <span className="font-semibold text-slate-100">Senior Software Architect</span>
                <span className="text-[11px] text-slate-400">Tech, Cloud & Systems (Alex Vance)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectSample(executiveResume);
                  setSampleDropdownOpen(false);
                }}
                className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition flex flex-col"
              >
                <span className="font-semibold text-slate-100">VP of Product Marketing</span>
                <span className="text-[11px] text-slate-400">Executive & GTM Leadership (Elena Rostova)</span>
              </button>
              <div className="my-1 border-t border-slate-800" />
              <button
                type="button"
                onClick={() => {
                  onSelectSample(blankResume);
                  setSampleDropdownOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-3 h-3 text-slate-400" />
                <span>Start from Blank Slate</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Center / Right Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* ATS Score Indicator */}
        <button
          type="button"
          onClick={onOpenAtsScore}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition"
          title="Audit resume against ATS algorithms"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>ATS Score: 88/100</span>
        </button>

        {/* AI Job Tailor Button */}
        <button
          type="button"
          onClick={onOpenJobTailor}
          className="px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center gap-1.5 transition"
        >
          <Target className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden md:inline">Tailor to Job</span>
        </button>

        {/* Upload & Auto-Parse Resume Button */}
        <button
          type="button"
          onClick={onOpenUpload}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 rounded-lg shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Import Resume</span>
        </button>

        {/* More Options Dropdown (JSON Backup) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            title="More actions"
          >
            <FolderOpen className="w-4 h-4" />
          </button>

          {moreDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-1.5 z-50 text-xs animate-in fade-in duration-150">
              <button
                type="button"
                onClick={handleExportJson}
                className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center gap-2"
              >
                <Save className="w-3.5 h-3.5 text-slate-400" />
                <span>Backup Resume Data (.json)</span>
              </button>
              <label className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center gap-2 cursor-pointer">
                <FolderOpen className="w-3.5 h-3.5 text-slate-400" />
                <span>Restore from JSON File</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleJsonFileInput}
                  className="hidden"
                />
              </label>
              <div className="my-1 border-t border-slate-800" />
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to clear this resume?')) {
                    onResetResume();
                  }
                  setMoreDropdownOpen(false);
                }}
                className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-rose-950/40 text-rose-300 flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                <span>Reset All Fields</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
