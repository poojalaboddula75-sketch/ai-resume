import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toPng } from 'html-to-image';
import { ResumeData } from '../types/resume';

export interface ExportPdfOptions {
  elementId?: string;
  fileName?: string;
  paperSize?: 'a4' | 'letter';
}

/**
 * Downloads the resume element as a clean, high-resolution PDF file.
 * Captures the actual visible resume with 100% fidelity to the preview.
 */
export async function downloadResumeAsPdf(options: ExportPdfOptions = {}): Promise<void> {
  const elementId = options.elementId || 'resume-document';
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Resume element #${elementId} was not found on the page.`);
  }

  const paperSize = options.paperSize || 'a4';
  const fileName = options.fileName || 'Resume.pdf';

  // Temporarily reset zoom transform on wrapper so it captures at natural 100% scale
  const zoomWrapper = document.getElementById('resume-zoom-wrapper');
  const prevTransform = zoomWrapper ? zoomWrapper.style.transform : '';
  if (zoomWrapper) {
    zoomWrapper.style.transform = 'none';
  }

  // Scroll to top
  const prevScroll = window.scrollY;
  window.scrollTo(0, 0);

  // Short pause for CSS reflow to ensure all elements are rendered at 100%
  await new Promise((r) => setTimeout(r, 80));

  let dataUrl = '';

  try {
    // Primary capture method: html2canvas with 2x resolution
    try {
      const canvas = await html2canvas(element, {
        scale: 2.2, // ~300 DPI for crisp text
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      if (canvas && canvas.width > 200 && canvas.height > 200) {
        dataUrl = canvas.toDataURL('image/jpeg', 0.98);
      }
    } catch (e1) {
      console.warn('html2canvas capture warning:', e1);
    }

    // Secondary fallback: html-to-image toPng
    if (!dataUrl || dataUrl.length < 2000) {
      try {
        dataUrl = await toPng(element, {
          quality: 0.98,
          pixelRatio: 2.2,
          backgroundColor: '#ffffff',
          skipFonts: true,
          cacheBust: true,
        });
      } catch (e2) {
        console.warn('html-to-image capture warning:', e2);
      }
    }

    if (!dataUrl || dataUrl.length < 2000) {
      throw new Error('Could not capture resume image. Please try the Print / Vector PDF option.');
    }

    // Dimensions in mm
    // A4: 210 x 297 mm
    // Letter: 215.9 x 279.4 mm
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: paperSize === 'letter' ? 'letter' : 'a4',
    });

    const pdfWidth = paperSize === 'letter' ? 215.9 : 210;
    const pdfHeight = paperSize === 'letter' ? 279.4 : 297;

    const imgProps = pdf.getImageProperties(dataUrl);
    const canvasRatio = imgProps.height / imgProps.width;
    const renderedHeightMm = pdfWidth * canvasRatio;

    // Check if it fits on a single page
    if (renderedHeightMm <= pdfHeight + 5) {
      pdf.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, renderedHeightMm, undefined, 'FAST');
    } else {
      // Multi-page slicing: each subsequent page shifts the Y coordinate up by pdfHeight
      let heightLeft = renderedHeightMm;
      let pageIndex = 0;

      while (heightLeft > 5) {
        if (pageIndex > 0) {
          pdf.addPage();
        }
        const positionY = -(pageIndex * pdfHeight);
        pdf.addImage(dataUrl, 'JPEG', 0, positionY, pdfWidth, renderedHeightMm, undefined, 'FAST');
        heightLeft -= pdfHeight;
        pageIndex += 1;
      }
    }

    pdf.save(fileName);
  } finally {
    // Restore transform and scroll position
    if (zoomWrapper) {
      zoomWrapper.style.transform = prevTransform;
    }
    window.scrollTo(0, prevScroll);
  }
}

/**
 * Triggers native browser print dialog for 100% vector-sharp PDF export.
 * Includes fallback for sandboxed iframe environments.
 */
export function printResume(): boolean {
  try {
    window.print();
    return true;
  } catch (err) {
    console.warn('Direct window.print() failed:', err);
    return false;
  }
}

/**
 * Prints the resume via an isolated iframe with clean print CSS
 */
export function printResumeViaIframe(): void {
  const element = document.getElementById('resume-document');
  if (!element) return;

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) return;

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Resume</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
        <link href="https://fonts.googleapis.com/css2?family=Fira+Code&family=Inter:wght@400;500;600;700&family=Merriweather:wght@400;700&family=Playfair+Display:wght@600;700&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap" rel="stylesheet">
        <style>
          @page { size: auto; margin: 0; }
          body { margin: 0; padding: 0; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          #resume-document { margin: 0 auto; box-shadow: none !important; width: 100% !important; }
        </style>
      </head>
      <body>
        ${element.outerHTML}
      </body>
    </html>
  `);
  doc.close();

  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.warn('iframe print exception:', e);
    } finally {
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 2000);
    }
  }, 500);
}

/**
 * Exports a standalone, printable HTML document that the user can open in any browser
 * and save as a vector PDF via Chrome/Safari/Edge print dialog without any iframe blocks.
 */
export function exportStandaloneHtml(resume: ResumeData, fileName?: string): void {
  const element = document.getElementById('resume-document');
  if (!element) return;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${resume.personalInfo.fullName || 'Resume'}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Inter:wght@300;400;500;600;700&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @page { size: auto; margin: 0; }
    body { background: #f8fafc; margin: 0; padding: 20px; font-family: 'Inter', sans-serif; }
    @media print {
      body { background: #ffffff; padding: 0; }
      .no-print { display: none !important; }
      #resume-document { box-shadow: none !important; margin: 0 !important; width: 100% !important; }
    }
    .print-bar {
      max-width: 800px;
      margin: 0 auto 16px auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #0f172a;
      color: #ffffff;
      padding: 12px 20px;
      border-radius: 10px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    }
    .print-btn {
      background: #2563eb;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="print-bar no-print">
    <div>
      <strong>${resume.personalInfo.fullName || 'Resume'}</strong> — Ready for PDF Export
    </div>
    <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
  </div>
  <div style="display: flex; justify-content: center;">
    ${element.outerHTML}
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName || `${(resume.personalInfo.fullName || 'Resume').replace(/\s+/g, '_')}.html`;
  a.click();
  URL.revokeObjectURL(url);
}
