import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles, X, ArrowRight, User, Briefcase, GraduationCap, Code } from 'lucide-react';
import { ResumeData } from '../../types/resume';

interface UploadResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyParsedData: (data: Partial<ResumeData>, mode: 'replace' | 'merge') => void;
}

export const UploadResumeModal: React.FC<UploadResumeModalProps> = ({
  isOpen,
  onClose,
  onApplyParsedData,
}) => {
  const [step, setStep] = useState<'upload' | 'review'>('upload');
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<'replace' | 'merge'>('replace');
  const [parsedData, setParsedData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleReset = () => {
    setStep('upload');
    setParsedData(null);
    setFile(null);
    setPastedText('');
    setError(null);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleStartParsing = async () => {
    setError(null);
    setIsProcessing(true);

    try {
      setProcessingStep('Reading document text...');
      let payload: any = {};

      if (activeTab === 'upload') {
        if (!file) {
          setError('Please select a resume file first.');
          setIsProcessing(false);
          return;
        }

        const mimeType = file.type || 'application/pdf';
        
        if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
          const text = await file.text();
          payload = { text };
        } else {
          const base64 = await readFileAsBase64(file);
          payload = {
            fileData: {
              base64,
              mimeType: mimeType === '' ? 'application/pdf' : mimeType,
              name: file.name,
            },
          };
        }
      } else {
        if (!pastedText.trim()) {
          setError('Please paste your resume text.');
          setIsProcessing(false);
          return;
        }
        payload = { text: pastedText.trim() };
      }

      setProcessingStep('Analyzing structure, roles, and skills...');
      
      const response = await fetch('/api/ai/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned error (${response.status})`);
      }

      const result = await response.json();
      if (!result.success || !result.data) {
        throw new Error('Could not parse resume data.');
      }

      setProcessingStep('Extracted career profile successfully!');
      await new Promise((r) => setTimeout(r, 300));

      setParsedData(result.data);
      setStep('review');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to extract resume. Please check the file and try again.');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const handleConfirmApply = () => {
    if (parsedData) {
      onApplyParsedData(parsedData, importMode);
      handleReset();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {step === 'upload' ? 'Import & Parse Existing Resume' : 'Verify Extracted Details'}
              </h3>
              <p className="text-xs text-slate-400">
                {step === 'upload'
                  ? 'Upload your PDF, Word/TXT file, or paste text to auto-populate all fields'
                  : 'Review the parsed information below before applying it to your resume canvas'}
              </p>
            </div>
          </div>
          <button
            onClick={() => { handleReset(); onClose(); }}
            disabled={isProcessing}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: UPLOAD / PASTE */}
        {step === 'upload' && (
          <div className="flex flex-col flex-1 overflow-y-auto">
            {/* Tab switcher */}
            <div className="flex border-b border-slate-800 px-5 pt-3 gap-2 bg-slate-950/40 shrink-0">
              <button
                onClick={() => { setActiveTab('upload'); setError(null); }}
                className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition ${
                  activeTab === 'upload'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                Upload File (PDF / DOC / TXT)
              </button>
              <button
                onClick={() => { setActiveTab('paste'); setError(null); }}
                className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition ${
                  activeTab === 'paste'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Paste Resume Text
              </button>
            </div>

            {/* Modal body */}
            <div className="p-5 space-y-4 flex-1">
              {error && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {activeTab === 'upload' ? (
                <div>
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
                      file
                        ? 'border-indigo-500/70 bg-indigo-500/5'
                        : 'border-slate-700 hover:border-slate-500 bg-slate-950/30'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.txt,.doc,.docx"
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    {file ? (
                      <div className="flex flex-col items-center">
                        <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-full mb-2">
                          <FileText className="w-8 h-8" />
                        </div>
                        <p className="text-sm font-semibold text-white">{file.name}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to extract
                        </p>
                        <span className="mt-3 text-xs text-indigo-400 underline">Change file</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="p-3 bg-slate-800 text-slate-300 rounded-full mb-3">
                          <Upload className="w-7 h-7" />
                        </div>
                        <p className="text-sm font-medium text-slate-200">
                          Drag & drop your resume file here
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Supports PDF, Word/TXT, and PNG/JPEG images (Up to 15MB)
                        </p>
                        <button
                          type="button"
                          className="mt-4 px-3.5 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
                        >
                          Browse Files
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Paste your full resume text below
                  </label>
                  <textarea
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Paste work experience, education, skills, contact info..."
                    rows={8}
                    className="w-full bg-slate-950/60 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              )}

              {/* Import mode selection */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/40 border border-slate-800 text-xs">
                <span className="text-slate-300 font-medium">Import Strategy:</span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Replace Existing</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'merge'}
                      onChange={() => setImportMode('merge')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Merge / Append</span>
                  </label>
                </div>
              </div>

              {/* Progress state */}
              {isProcessing && (
                <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-indigo-400 animate-spin shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-indigo-200">
                      {processingStep || 'Processing resume document...'}
                    </p>
                    <p className="text-[11px] text-indigo-400/80">
                      Extracting candidate name, titles, dates, metrics, and skill categories
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStartParsing}
                disabled={isProcessing || (activeTab === 'upload' && !file) || (activeTab === 'paste' && !pastedText.trim())}
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 rounded-lg shadow-md shadow-indigo-600/20 flex items-center gap-2 transition"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Extracting Data...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Parse Resume Content
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: REVIEW & VERIFY EXTRACED DETAILS */}
        {step === 'review' && parsedData && (
          <div className="flex flex-col flex-1 overflow-y-auto">
            <div className="p-5 space-y-4 flex-1">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>
                  Extraction successful! Found {parsedData.experiences?.length || 0} roles, {parsedData.skills?.flatMap((s: any) => s.items)?.length || 0} skills, and {parsedData.education?.length || 0} education records.
                </span>
              </div>

              {/* Editable Name & Job Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Candidate Full Name
                  </label>
                  <input
                    type="text"
                    value={parsedData.personalInfo?.fullName || ''}
                    onChange={(e) => {
                      setParsedData({
                        ...parsedData,
                        personalInfo: { ...parsedData.personalInfo, fullName: e.target.value },
                      });
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-semibold focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Job Title / Role
                  </label>
                  <input
                    type="text"
                    value={parsedData.personalInfo?.jobTitle || ''}
                    onChange={(e) => {
                      setParsedData({
                        ...parsedData,
                        personalInfo: { ...parsedData.personalInfo, jobTitle: e.target.value },
                      });
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-semibold focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-300 bg-slate-950/30 p-3 rounded-lg border border-slate-800/80">
                <div>
                  <span className="text-[10px] text-slate-500 block">Email</span>
                  <span className="font-medium truncate block">{parsedData.personalInfo?.email || 'None'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Phone</span>
                  <span className="font-medium truncate block">{parsedData.personalInfo?.phone || 'None'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Location</span>
                  <span className="font-medium truncate block">{parsedData.personalInfo?.location || 'None'}</span>
                </div>
              </div>

              {/* Extracted Experiences Preview */}
              {parsedData.experiences && parsedData.experiences.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                    Detected Experience ({parsedData.experiences.length})
                  </div>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {parsedData.experiences.map((exp: any, i: number) => (
                      <div key={i} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
                        <div className="flex justify-between font-semibold text-slate-200">
                          <span>{exp.role}</span>
                          <span className="text-[11px] text-slate-400 font-normal">{exp.startDate} - {exp.endDate || 'Present'}</span>
                        </div>
                        <div className="text-[11px] text-emerald-400">{exp.company}</div>
                        {exp.bullets && exp.bullets.length > 0 && (
                          <div className="text-[11px] text-slate-400 mt-1 line-clamp-1 italic">
                            • {exp.bullets[0]}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extracted Skills Preview */}
              {parsedData.skills && (
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-amber-400" />
                    Detected Skills
                  </div>
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                    {parsedData.skills.flatMap((s: any) => s.items).slice(0, 16).map((sk: string, i: number) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => setStep('upload')}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition"
              >
                ← Back to Upload
              </button>
              <button
                type="button"
                onClick={handleConfirmApply}
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-md shadow-emerald-600/20 flex items-center gap-2 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                Looks Great! Populate Resume
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
