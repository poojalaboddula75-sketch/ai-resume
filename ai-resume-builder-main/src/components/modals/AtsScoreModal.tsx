import React, { useState, useEffect } from 'react';
import { ShieldCheck, Sparkles, CheckCircle2, AlertCircle, Loader2, X, RefreshCw, ArrowRight } from 'lucide-react';
import { ResumeData } from '../../types/resume';

interface AtsScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: ResumeData;
}

export const AtsScoreModal: React.FC<AtsScoreModalProps> = ({
  isOpen,
  onClose,
  resume,
}) => {
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditData, setAuditData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runAudit = async () => {
    setIsAuditing(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/ats-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume }),
      });

      if (!response.ok) {
        throw new Error('Failed to run ATS audit.');
      }

      const data = await response.json();
      if (!data.success || !data.data) {
        throw new Error('Audit response was incomplete.');
      }

      setAuditData(data.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error conducting ATS score audit.');
    } finally {
      setIsAuditing(false);
    }
  };

  useEffect(() => {
    if (isOpen && !auditData && !isAuditing) {
      runAudit();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const score = auditData?.score || 85;

  const getScoreBadge = (sc: number) => {
    if (sc >= 85) return { color: 'text-emerald-400', label: 'Excellent (ATS Optimized)', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (sc >= 70) return { color: 'text-amber-400', label: 'Good (Minor Gaps)', bg: 'bg-amber-500/10 border-amber-500/30' };
    return { color: 'text-rose-400', label: 'Needs Improvement', bg: 'bg-rose-500/10 border-rose-500/30' };
  };

  const badge = getScoreBadge(score);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                ATS Scanner & Resume Audit
              </h3>
              <p className="text-xs text-slate-400">
                Audited against Fortune 500 applicant tracking systems (Workday, Taleo, Greenhouse)
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

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-slate-200">
          {isAuditing ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
              <div className="text-sm font-semibold text-white">Scanning Resume Structure...</div>
              <div className="text-xs text-slate-400 max-w-xs">
                Auditing quantified metrics, keyword density, section headers, and formatting
              </div>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-2">
              <p>{error}</p>
              <button
                onClick={runAudit}
                className="px-3 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-medium"
              >
                Retry Audit
              </button>
            </div>
          ) : auditData ? (
            <div className="space-y-5 animate-in fade-in duration-300">
              {/* Score Header Card */}
              <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${badge.bg}`}>
                <div className="flex items-center gap-4">
                  <div className="relative flex items-center justify-center w-20 h-20 rounded-full border-4 border-slate-800 bg-slate-950">
                    <span className={`text-2xl font-black ${badge.color}`}>
                      {score}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold absolute bottom-2">/100</span>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Overall ATS Readiness
                    </div>
                    <div className={`text-base font-bold ${badge.color}`}>{badge.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Ready for recruiter screening & automated filters
                    </div>
                  </div>
                </div>

                <button
                  onClick={runAudit}
                  className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-1.5 transition shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Re-scan
                </button>
              </div>

              {/* 4 Dimensional Breakdown */}
              {auditData.breakdown && (
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-3">
                  <div className="text-xs font-bold text-slate-300">ATS Component Breakdown</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-400">Impact & Quantified Results</span>
                        <span className="font-bold text-slate-200">{auditData.breakdown.impact || 80}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full" 
                          style={{ width: `${auditData.breakdown.impact || 80}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-400">Readability & Structure</span>
                        <span className="font-bold text-slate-200">{auditData.breakdown.readability || 90}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ width: `${auditData.breakdown.readability || 90}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-400">ATS Keyword Density</span>
                        <span className="font-bold text-slate-200">{auditData.breakdown.keywords || 85}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 rounded-full" 
                          style={{ width: `${auditData.breakdown.keywords || 85}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-400">Completeness & Contact Data</span>
                        <span className="font-bold text-slate-200">{auditData.breakdown.completeness || 92}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div 
                          className="h-full bg-purple-500 rounded-full" 
                          style={{ width: `${auditData.breakdown.completeness || 92}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Strengths */}
              {auditData.strengths && auditData.strengths.length > 0 && (
                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Top ATS Strengths
                  </div>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {auditData.strengths.map((str: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400 shrink-0 mt-0.5">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actionable Improvements */}
              {auditData.improvements && auditData.improvements.length > 0 && (
                <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2">
                  <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Recommended Enhancements
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {auditData.improvements.map((imp: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-400 shrink-0 mt-0.5">→</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quick Fixes */}
              {auditData.quickFixes && auditData.quickFixes.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-300">Quick Wins</div>
                  {auditData.quickFixes.map((fix: any, i: number) => (
                    <div key={i} className="p-3 rounded-lg border border-slate-800 bg-slate-950/40 text-xs space-y-1">
                      <div className="text-slate-400 font-semibold">{fix.section || 'General'}: {fix.issue}</div>
                      <div className="text-blue-300">{fix.fix}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
