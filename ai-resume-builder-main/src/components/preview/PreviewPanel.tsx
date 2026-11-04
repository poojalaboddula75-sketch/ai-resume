import React, { useState } from 'react';
import { ResumeData } from '../../types/resume';
import { ResumeRenderer } from '../templates/ResumeRenderer';
import { 
  Download, Printer, ZoomIn, ZoomOut, Maximize2, 
  RotateCcw, Sparkles, FileDown, Check, Loader2, Eye 
} from 'lucide-react';
import { downloadResumeAsPdf, printResume, printResumeViaIframe, exportStandaloneHtml } from '../../utils/pdfExport';

interface PreviewPanelProps {
  resume: ResumeData;
  onOpenUpload: () => void;
  onOpenJobTailor: () => void;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  resume,
  onOpenUpload,
  onOpenJobTailor,
}) => {
  const [zoom, setZoom] = useState<number>(100);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50));
  const handleZoomReset = () => setZoom(100);

  const [exportError, setExportError] = useState<string | null>(null);
  const [exportMenuOpen, setExportMenuOpen] = useState<boolean>(false);

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    setExportSuccess(false);
    setExportError(null);

    const safeName = (resume.personalInfo.fullName || 'Resume')
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${safeName}_Resume.pdf`;

    try {
      await downloadResumeAsPdf({
        elementId: 'resume-document',
        fileName,
        paperSize: resume.design.paperSize,
      });
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3500);
    } catch (err: any) {
      console.error('Failed to export PDF:', err);
      setExportError(err.message || 'Error generating PDF file.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportHtml = () => {
    try {
      const safeName = (resume.personalInfo.fullName || 'Resume')
        .replace(/[^a-zA-Z0-9_-]/g, '_');
      exportStandaloneHtml(resume, `${safeName}_Resume.html`);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err: any) {
      setExportError('Could not export standalone HTML file.');
    }
  };

  const [printHintOpen, setPrintHintOpen] = useState<boolean>(false);

  const handlePrintClick = () => {
    const success = printResume();
    // Also try iframe print as reinforcement
    printResumeViaIframe();
    // Show hint for users whose browsers block sandbox prints
    setPrintHintOpen(true);
    setTimeout(() => setPrintHintOpen(false), 5000);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 overflow-hidden relative">
      {/* Top Controls Toolbar (no-print) */}
      <div className="no-print h-14 border-b border-slate-800 bg-slate-900/90 px-4 flex items-center justify-between gap-2 shrink-0">
        {/* Left: Quick info & zoom */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
            Preview ({resume.design.paperSize.toUpperCase()})
          </span>
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs text-slate-300">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              className="p-1 hover:text-white disabled:opacity-40 rounded"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 font-mono text-[11px] min-w-10 text-center select-none">
              {zoom}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= 150}
              className="p-1 hover:text-white disabled:opacity-40 rounded"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleZoomReset}
              className="p-1 hover:text-white rounded border-l border-slate-800 ml-0.5"
              title="Reset Zoom (100%)"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Center: Live status indicator */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Real-time Live Sync</span>
        </div>

        {/* Right: Export PDF Action Buttons */}
        <div className="flex items-center gap-2 relative">
          {/* Native Print Dialog (Vector PDF) */}
          <button
            type="button"
            onClick={handlePrintClick}
            className="px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center gap-1.5 transition"
            title="Crisp vector PDF via system print dialog"
          >
            <Printer className="w-3.5 h-3.5 text-slate-300" />
            <span className="hidden sm:inline">Print / Vector PDF</span>
          </button>

          {/* Direct .pdf File Download */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 rounded-lg shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Generating PDF...
              </>
            ) : exportSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                PDF Downloaded!
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </>
            )}
          </button>

          {/* More Export Formats Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
              className="p-1.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition"
              title="More export options"
            >
              <FileDown className="w-4 h-4" />
            </button>

            {exportMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-60 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 text-xs animate-in fade-in duration-150">
                <button
                  type="button"
                  onClick={() => {
                    handleDownloadPdf();
                    setExportMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-indigo-400" />
                  <div>
                    <div className="font-semibold text-white">Direct PDF File (.pdf)</div>
                    <div className="text-[11px] text-slate-400">High-res rendered PDF download</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handlePrintClick();
                    setExportMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center gap-2"
                >
                  <Printer className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-semibold text-white">System Print / Vector PDF</div>
                    <div className="text-[11px] text-slate-400">Selectable text & 0% loss</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleExportHtml();
                    setExportMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center gap-2"
                >
                  <FileDown className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="font-semibold text-white">Standalone HTML (.html)</div>
                    <div className="text-[11px] text-slate-400">Self-contained offline printable file</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Print notice toast */}
      {printHintOpen && (
        <div className="no-print absolute top-16 left-1/2 -translate-x-1/2 z-40 p-3 rounded-xl bg-slate-900/95 border border-indigo-500/40 text-slate-200 text-xs shadow-2xl flex items-center gap-3 animate-in fade-in max-w-lg">
          <div className="flex-1">
            <span className="font-semibold text-indigo-300">Opening Print Dialog...</span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              If your browser blocks the print pop-up in this frame, press <kbd className="px-1 py-0.5 bg-slate-800 rounded font-mono text-indigo-300">Ctrl + P</kbd> (or <kbd className="px-1 py-0.5 bg-slate-800 rounded font-mono text-indigo-300">⌘ + P</kbd>), or click <strong>Download PDF</strong>.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPrintHintOpen(false)}
            className="text-slate-400 hover:text-white p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Floating feedback alert if error */}
      {exportError && (
        <div className="no-print absolute top-16 right-4 z-40 p-3 rounded-xl bg-rose-950/90 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-3 shadow-xl max-w-md animate-in fade-in">
          <span>{exportError}</span>
          <button
            type="button"
            onClick={handlePrintClick}
            className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-semibold shrink-0"
          >
            Use System Print
          </button>
          <button
            type="button"
            onClick={() => setExportError(null)}
            className="text-rose-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Canvas Paper Container */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start bg-slate-950/90 relative">
        <div
          id="resume-zoom-wrapper"
          className="transition-transform duration-100 ease-out origin-top shadow-2xl rounded-sm"
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
          }}
        >
          <ResumeRenderer data={resume} />
        </div>
      </div>
    </div>
  );
};
