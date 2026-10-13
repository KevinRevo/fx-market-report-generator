/**
 * Robust High-Res PNG Exporter for Institutional Reports
 * 
 * Solves html2canvas pitfalls:
 * 1. Checks if html2canvas is loaded, auto-loads CDN fallback if missing.
 * 2. Clones the target report offscreen with absolute positioning and fixed width/height
 *    so scrollbars, flex layout issues and parent overflow don't cut off or blank out the image.
 * 3. Uses canvas.toBlob() to avoid massive base64 URL truncation.
 * 4. Falls back to window.print() if canvas rendering is blocked.
 */
(function(root) {
  'use strict';

  function ensureHtml2Canvas() {
    return new Promise((resolve, reject) => {
      if (typeof window.html2canvas === 'function') {
        return resolve(window.html2canvas);
      }
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      script.crossOrigin = 'anonymous';
      script.onload = () => resolve(window.html2canvas);
      script.onerror = () => reject(new Error('Impossible de charger html2canvas.'));
      document.head.appendChild(script);
    });
  }

  async function exportElementToPNG(targetElement, filename, fallbackPrintFn) {
    if (!targetElement) {
      if (window.App) window.App.showToast('Élément à exporter introuvable.', 'error');
      return;
    }

    if (window.App) {
      window.App.showToast('Génération du fichier PNG haute résolution en cours...', 'info', 4000);
    }

    try {
      const h2c = await ensureHtml2Canvas();

      // Create an off-screen clone with exact pixel dimensions to avoid flexbox/scrolling artifacts
      const clone = targetElement.cloneNode(true);
      clone.style.position = 'fixed';
      clone.style.top = '-99999px';
      clone.style.left = '-99999px';
      clone.style.display = 'flex';
      clone.style.flexDirection = 'row';
      clone.style.gap = '20px';
      clone.style.width = '1628px'; // 794px * 2 + 20px gap + 20px padding
      clone.style.margin = '0';
      clone.style.transform = 'none';
      clone.style.zIndex = '-9999';
      document.body.appendChild(clone);

      // Force inline backgrounds and wait a tick for rendering
      await new Promise(r => setTimeout(r, 100));

      const canvas = await h2c(clone, {
        scale: 2, // 2x crisp retina resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#94a3b8',
        logging: false,
        width: 1628,
        windowWidth: 1628
      });

      // Cleanup clone immediately
      document.body.removeChild(clone);

      // Trigger download using Blob (avoids browser dataURI limits)
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Canvas toBlob failed');
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = filename || 'RAPPORT_FX.png';
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 2000);

        if (window.App) {
          window.App.showToast('Image PNG téléchargée avec succès !', 'success');
        }
      }, 'image/png');

    } catch (err) {
      console.error('PNG export failed:', err);
      if (window.App) {
        window.App.showToast('Export PNG échoué. Ouverture de l\'aperçu d\'impression...', 'warning', 3000);
      }
      if (typeof fallbackPrintFn === 'function') {
        fallbackPrintFn();
      } else {
        window.print();
      }
    }
  }

  root.ReportExport = {
    exportElementToPNG
  };
})(typeof window !== 'undefined' ? window : globalThis);
