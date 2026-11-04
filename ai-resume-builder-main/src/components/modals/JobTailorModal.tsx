import React, { useState } from 'react';
import { Target, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Loader2, X, RefreshCw, Plus, Check } from 'lucide-react';
import { ResumeData } from '../../types/resume';

interface JobTailorModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: ResumeData;
  onApplySummary: (summary: string) => void;
  onApplyBulletRewrite: (role: string, original: string, suggested: string) => void;
  onAddSkills: (skills: string[]) => void;
}

export const JobTailorModal: React.FC<JobTailorModalProps> = ({
  isOpen,
  onClose,
  resume,
  onApplySummary,
  onApplyBulletRewrite,
  onAddSkills,
}) => {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [appliedSummary, setAppliedSummary] = useState(false);
  const [appliedBullets, setAppliedBullets] = useState<Record<number, boolean>>({});
  const [addedSkills, setAddedSkills] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError('Please paste a target job description or requirements.');
      return;
    }

    setError(null);
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAppliedSummary(false);
    setAppliedBullets({});

    try {
      const response = await fetch('/api/ai/tailor-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume,
          jobDescription: jobDescription.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze job matching.');
      }

      const data = await response.json();
      if (!data.success || !data.data) {
        throw new Error('Analysis result was invalid.');
      }

      setAnalysisResult(data.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error tailoring resume to job description.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplySummary = () => {
    if (analysisResult?.tailoredSummary) {
      onApplySummary(analysisResult.tailoredSummary);
      setAppliedSummary(true);
    }
  };

  const handleApplyBullet = (idx: number, role: string, original: string, suggested: string) => {
    onApplyBulletRewrite(role, original, suggested);
    setAppliedBullets((prev) => ({ ...prev, [idx]: true }));
  };

  const handleAddKeyword = (keyword: string) => {
    onAddSkills([keyword]);
    setAddedSkills((prev) => ({ ...prev, [keyword]: true }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 60) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                AI Target Job Tailor
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ATS Match
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Paste any job posting to calculate ATS match score & generate role-specific enhancements
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-slate-200">
          {/* Job description input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Paste Target Job Description or Key Requirements
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="e.g. We are looking for a Senior Engineer with 5+ years experience in React, TypeScript, GraphQL, AWS..."
              rows={4}
              className="w-full bg-slate-950/70 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            <div className="flex justify-between items-center pt-1">
              <span className="text-[11px] text-slate-400">
                Tip: Include the responsibilities, requirements, and tech stack for best matching.
              </span>
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isAnalyzing || !jobDescription.trim()}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-lg flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Analyzing Match...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Tailor & Match Resume
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Analysis Results Display */}
          {analysisResult && (
            <div className="space-y-5 border-t border-slate-800 pt-5 animate-in fade-in duration-300">
              {/* Score Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className={`p-4 rounded-xl border flex items-center gap-3 ${getScoreColor(analysisResult.matchScore || 75)}`}>
                  <div className="text-3xl font-extrabold">{analysisResult.matchScore || 75}%</div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider">ATS Match Score</div>
                    <div className="text-[11px] opacity-80">Keyword & experience alignment</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 sm:col-span-2 flex flex-col justify-center">
                  <div className="text-xs font-semibold text-slate-300 mb-1">
                    Matched Keywords ({analysisResult.matchingKeywords?.length || 0})
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(analysisResult.matchingKeywords || []).slice(0, 8).map((kw: string, i: number) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Missing ATS Keywords */}
              {analysisResult.missingKeywords && analysisResult.missingKeywords.length > 0 && (
                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Critical Missing Keywords (From Job Post)
                    </span>
                    <span className="text-[11px] text-amber-400/80">Click + to add to your skills</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.missingKeywords.map((kw: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => handleAddKeyword(kw)}
                        disabled={addedSkills[kw]}
                        className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition ${
                          addedSkills[kw]
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-900 text-amber-200 border-amber-500/40 hover:bg-amber-500/20'
                        }`}
                      >
                        {addedSkills[kw] ? <Check className="w-3 h-3 text-emerald-400" /> : <Plus className="w-3 h-3 text-amber-400" />}
                        {kw}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tailored Executive Summary */}
              {analysisResult.tailoredSummary && (
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      Tailored Executive Summary
                    </span>
                    <button
                      onClick={handleApplySummary}
                      disabled={appliedSummary}
                      className={`text-xs px-3 py-1 rounded-md font-semibold flex items-center gap-1 transition ${
                        appliedSummary
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      {appliedSummary ? (
                        <>
                          <Check className="w-3 h-3" />
                          Applied to Resume
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-3 h-3" />
                          Apply to Resume
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    "{analysisResult.tailoredSummary}"
                  </p>
                </div>
              )}

              {/* Recommended Bullet Rewrites */}
              {analysisResult.recommendedBulletRewrites && analysisResult.recommendedBulletRewrites.length > 0 && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-200">
                    Targeted Experience Bullet Rewrites
                  </div>
                  <div className="space-y-3">
                    {analysisResult.recommendedBulletRewrites.map((item: any, idx: number) => (
                      <div key={idx} className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2 text-xs">
                        <div className="flex items-center justify-between text-slate-400 text-[11px]">
                          <span>Role: <strong className="text-slate-300">{item.role || 'Experience'}</strong></span>
                          <span className="text-indigo-400">{item.reason}</span>
                        </div>
                        <div className="text-slate-400 line-through text-[11px]">
                          {item.original}
                        </div>
                        <div className="text-emerald-300 font-medium bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-500/20">
                          {item.suggested}
                        </div>
                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => handleApplyBullet(idx, item.role, item.original, item.suggested)}
                            disabled={appliedBullets[idx]}
                            className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 transition ${
                              appliedBullets[idx]
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                            }`}
                          >
                            {appliedBullets[idx] ? (
                              <>
                                <Check className="w-3 h-3" /> Applied
                              </>
                            ) : (
                              'Replace Original Bullet'
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actionable Tips */}
              {analysisResult.actionableTips && (
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2">
                  <div className="text-xs font-bold text-slate-200">Recruiter & ATS Optimization Tips</div>
                  <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-300">
                    {analysisResult.actionableTips.map((tip: string, i: number) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
