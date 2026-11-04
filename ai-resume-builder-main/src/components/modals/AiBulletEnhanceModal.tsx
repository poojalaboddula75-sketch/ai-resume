import React, { useState, useEffect } from 'react';
import { Sparkles, Check, ArrowRight, Loader2, X, Copy, Zap } from 'lucide-react';

interface AiBulletEnhanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalBullet: string;
  role?: string;
  company?: string;
  onApplyBullet: (newBullet: string) => void;
}

export const AiBulletEnhanceModal: React.FC<AiBulletEnhanceModalProps> = ({
  isOpen,
  onClose,
  originalBullet,
  role,
  company,
  onApplyBullet,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [options, setOptions] = useState<Array<{ type: string; text: string; highlight: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const fetchEnhancements = async () => {
    if (!originalBullet.trim()) return;
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/enhance-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bullet: originalBullet,
          role,
          company,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to enhance bullet point');
      }

      const data = await response.json();
      setOptions(data.data || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error generating improvements');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (isOpen && originalBullet) {
      fetchEnhancements();
    }
  }, [isOpen, originalBullet]);

  if (!isOpen) return null;

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI Bullet Point Enhancer</h3>
              <p className="text-[11px] text-slate-400">STAR formula & quantifiable business impact</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Original */}
          <div className="space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Original Bullet
            </div>
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
              {originalBullet}
            </div>
          </div>

          {isGenerating ? (
            <div className="py-8 flex flex-col items-center justify-center space-y-2">
              <Loader2 className="w-7 h-7 text-amber-400 animate-spin" />
              <p className="text-xs text-slate-300 font-medium">Drafting STAR metric-driven variations...</p>
            </div>
          ) : error ? (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                AI Suggested Upgrades
              </div>
              {options.map((opt, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/50 hover:border-amber-500/40 transition space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {opt.type}
                    </span>
                    <span className="text-[11px] text-slate-400 italic">{opt.highlight}</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {opt.text}
                  </p>
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleCopy(opt.text, idx)}
                      className="px-2.5 py-1 text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded flex items-center gap-1 transition"
                    >
                      {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedIdx === idx ? 'Copied' : 'Copy'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onApplyBullet(opt.text);
                        onClose();
                      }}
                      className="px-3 py-1 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded flex items-center gap-1 shadow-xs transition"
                    >
                      <Zap className="w-3 h-3" />
                      Apply Bullet
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <button
            type="button"
            onClick={fetchEnhancements}
            disabled={isGenerating}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Regenerate more options
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
