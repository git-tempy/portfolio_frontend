import {textFor} from '../lib/uiText';
import { useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Download } from 'lucide-react';
import PdfPage from './PdfPage';

export default function MediaViewer({ title, category, description, images = [], pdfUrl, downloadUrl, onClose, language = 'ENG', children }) {
  const dialog = useRef(null), stage = useRef(null), pointers = useRef(new Map()), gesture = useRef(null);
  const [index, setIndex] = useState(0), [zoom, setZoom] = useState(1), [pdfCount, setPdfCount] = useState(1);
  const [size, setSize] = useState({ width: 900, height: 650 });
  const [natural, setNatural] = useState({ width: 1200, height: 800 });
  const [failed, setFailed] = useState(false), [loaded, setLoaded] = useState(false);
  const count = pdfUrl ? pdfCount : images.length;
  const t=textFor(language);
  const move = delta => { setIndex(i => (i + delta + count) % count); setZoom(1); setFailed(false); setLoaded(false); if(stage.current) stage.current.scrollTo(0,0); };
  const fit = Math.min((size.width - 32)/natural.width, (size.height - 32)/natural.height, 1);
  useEffect(() => {
    const node = dialog.current;
    const previous = document.activeElement, overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    node.showModal();
    const observer = new ResizeObserver(entries => {
      const rect = entries[0].contentRect;
      setSize({ width: rect.width, height: rect.height });
    });
    if (stage.current) observer.observe(stage.current);
    return () => { observer.disconnect(); node.close(); document.body.style.overflow = overflow; previous?.focus?.(); };
  }, []);
  const onKey = e => {
    if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    if (count > 1 && e.key === 'ArrowRight') { e.preventDefault(); move(1); }
    if (count > 1 && e.key === 'ArrowLeft') { e.preventDefault(); move(-1); }
  };
  const pointerDown = e => {
    if (e.pointerType === 'mouse' && zoom === 1) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x:e.clientX, y:e.clientY });
    if (pointers.current.size === 2) {
      const [a,b] = [...pointers.current.values()];
      gesture.current = { distance: Math.hypot(a.x-b.x,a.y-b.y), zoom };
    } else gesture.current = { x:e.clientX, y:e.clientY };
  };
  const pointerMove = e => {
    const last = pointers.current.get(e.pointerId);
    if (!last) return;
    pointers.current.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if (pointers.current.size === 2 && gesture.current?.distance) {
      const [a,b] = [...pointers.current.values()];
      setZoom(Math.max(1,Math.min(24,gesture.current.zoom * Math.hypot(a.x-b.x,a.y-b.y)/gesture.current.distance)));
    } else if (zoom > 1) {
      stage.current.scrollLeft -= e.clientX-last.x;
      stage.current.scrollTop -= e.clientY-last.y;
    }
  };
  const pointerUp = e => {
    if (pointers.current.size === 1 && zoom === 1 && count > 1 && gesture.current?.x != null) {
      const dx=e.clientX-gesture.current.x, dy=e.clientY-gesture.current.y;
      if(Math.abs(dx)>60 && Math.abs(dx)>Math.abs(dy)*1.4) move(dx<0 ? 1 : -1);
    }
    pointers.current.delete(e.pointerId); if(!pointers.current.size) gesture.current=null;
  };
  return <dialog ref={dialog} className="media-dialog" aria-label={title} onCancel={e=>{e.preventDefault();onClose();}} onKeyDown={onKey}>
    <header className="viewer-header"><div className="viewer-title"><span className="eyebrow">{category || 'DESONE / PORTFOLIO'}</span><h2>{title}</h2></div><div className="viewer-tools">{downloadUrl && <a className="button button-primary resume-download" href={downloadUrl} download><Download size={17}/><span>{t.download}</span></a>}<button autoFocus className="icon-button" aria-label={t.close} onClick={onClose}><X/></button></div></header>
    {description && <p className="viewer-description">{description}</p>}
    <div className="viewer-stage" ref={stage} style={{touchAction:zoom>1?'none':'pan-y'}} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={e=>{pointers.current.delete(e.pointerId);gesture.current=null;}} onContextMenu={e=>e.preventDefault()}>
      {children || (pdfUrl ? <PdfPage key={pdfUrl} url={pdfUrl} page={index+1} onCount={setPdfCount} zoom={zoom} language={language}/> : images.length ? <div className={'viewer-image-wrap '+(zoom>1?'is-zoomed':'')} style={zoom>1 ? {width:Math.max(size.width,natural.width*fit*zoom+32),height:Math.max(size.height,natural.height*fit*zoom+32)}:{}}>{!loaded && !failed && <span className="spinner" aria-label={t.loading}/>}{failed ? <div className="viewer-message" role="alert">{t.unavailable}</div>:<img key={index} src={images[index].image || images[index]} alt={title+' — '+(index+1)} draggable="false" style={{width:Math.max(1,natural.width*fit*zoom),height:Math.max(1,natural.height*fit*zoom),opacity:loaded?1:0}} onLoad={e=>{setNatural({width:e.currentTarget.naturalWidth,height:e.currentTarget.naturalHeight});setLoaded(true);}} onError={()=>setFailed(true)}/>}</div>:<div className="viewer-message">{t.noImages}</div>)}
    </div>
    <footer className="viewer-footer"><div className="viewer-paging"><button className="icon-button" disabled={count<=1} aria-label={t.previous} onClick={()=>move(-1)}><ChevronLeft/></button><span aria-live="polite">{count? index+1:0} <span className="muted">/ {count}</span></span><button className="icon-button" disabled={count<=1} aria-label={t.next} onClick={()=>move(1)}><ChevronRight/></button></div><div className="viewer-zoom"><button className="icon-button" aria-label={t.zoomOut} disabled={zoom<=1} onClick={()=>setZoom(z=>Math.max(1,z/1.5))}><ZoomOut size={18}/></button><button className="text-button" onClick={()=>{setZoom(1);stage.current?.scrollTo(0,0);}}>{Math.round(zoom*100)}%</button><button className="icon-button" aria-label={t.zoomIn} disabled={zoom>=24} onClick={()=>setZoom(z=>Math.min(24,z*1.5))}><ZoomIn size={18}/></button><button className="icon-button" aria-label={t.fit} onClick={()=>setZoom(pdfUrl?1.5:Math.max(1,(size.width-32)/natural.width/fit))}><Maximize2 size={18}/></button></div></footer>
    {!pdfUrl && images.length>1 && <div className="viewer-thumbnails" aria-label={t.gallery}>{images.map((img,i)=><button key={i} aria-label={t.image+' '+(i+1)} aria-current={index===i?'true':undefined} onClick={()=>{if(i===index)return;setIndex(i);setZoom(1);setLoaded(false);setFailed(false);stage.current?.scrollTo(0,0);}}><img src={img.image||img} alt="" loading="lazy" draggable="false"/></button>)}</div>}
  </dialog>;
}
