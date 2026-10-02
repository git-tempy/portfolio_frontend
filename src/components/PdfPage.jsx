import { useEffect, useRef, useState } from 'react';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import {textFor} from '../lib/uiText';
export default function PdfPage({ url, page, onCount, zoom, language='ENG' }) {
  const canvas = useRef(null);
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let task, disposed = false;
    import('pdfjs-dist').then(pdfjs => {
      if (disposed) return;
      pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
      task = pdfjs.getDocument({ url, isEvalSupported: false });
      return task.promise;
    }).then(doc => { if (doc && !disposed) { setDocument(doc); onCount(doc.numPages); } })
      .catch(() => { if (!disposed) setError(true); });
    return () => { disposed = true; task?.destroy(); };
  }, [url, onCount]);
  useEffect(() => {
    if (!document) return;
    let disposed = false, render;
    // Each render owns its canvas; cancelled work cannot contend with the next page.
    const node = window.document.createElement('canvas');
    canvas.current.replaceChildren(node);
    document.getPage(page).then(pdfPage => {
      if (disposed) return;
      const base = pdfPage.getViewport({ scale: 1 });
      const scale = Math.min(2, 2400 / Math.max(base.width, base.height));
      const viewport = pdfPage.getViewport({ scale });
      node.width = viewport.width; node.height = viewport.height;
      node.setAttribute('role', 'img');
      node.setAttribute('aria-label', ({UZ:'Hujjat sahifasi',ENG:'Document page',RU:'Страница документа',JP:'文書のページ'})[language]+' '+page);
      render = pdfPage.render({ canvasContext: node.getContext('2d'), viewport });
      return render.promise;
    }).catch(e => { if (!disposed && e.name !== 'RenderingCancelledException') setError(true); });
    return () => { disposed = true; render?.cancel(); };
  }, [document, page, language]);
  if (error) return <div className="viewer-message" role="alert">{textFor(language).unavailable}</div>;
  return <div className="pdf-render" ref={canvas} style={{ width: zoom === 1 ? undefined : zoom * 100 + '%', maxWidth: zoom === 1 ? '100%' : 'none' }} aria-busy={!document}>{!document && <span className="spinner" />}</div>;
}
