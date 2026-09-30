import { useEffect, useRef, useState } from 'react';
import { Upload, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { optimizeImage } from '../lib/optimizeImage';
import './ImageUpload.css';
const bytes=n=>n<1024*1024?Math.round(n/1024)+' KB':(n/1024/1024).toFixed(1)+' MB';
function FilePreview({ file }) {
  const [url,setUrl]=useState('');
  useEffect(()=>{const next=URL.createObjectURL(file);
    // Object URLs are external resources tied to the lifetime of this file.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUrl(next);return()=>URL.revokeObjectURL(next);
  },[file]);
  return <img src={url||undefined} alt={file.name}/>;
}
export default function ImageUpload({ value=[],onChange,onBusy,kind='gallery',language='ENG',existing=[] }) {
  const input=useRef(null),controller=useRef(null),sequence=useRef(0);
  const [busy,setBusy]=useState(false),[error,setError]=useState(''),[progress,setProgress]=useState(''),[report,setReport]=useState(null),[drag,setDrag]=useState(false);
  const uz=language==='UZ';
  useEffect(()=>()=>{sequence.current++;controller.current?.abort();},[]);
  async function choose(files) {
    const chosen=Array.from(files||[]);
    if(!chosen.length)return;
    if(kind==='gallery'&&value.length+chosen.length>20){setError(uz?'Bir yuklashda 20 tagacha rasm.':'Choose up to 20 images per upload.');return;}
    if(chosen.reduce((n,f)=>n+f.size,0)>150*1024*1024){setError(uz?'Jami fayllar 150 MB dan kichik bo‘lishi kerak.':'The selected files must total less than 150 MB.');return;}
    controller.current?.abort();
    const run=++sequence.current, aborter=new AbortController();controller.current=aborter;
    setBusy(true);onBusy?.(true);setError('');setReport(null);
    let before=0,after=0;
    const next=kind==='cover'?[]:[...value];
    try {
      const selected=kind==='cover'?chosen.slice(0,1):chosen;
      for(let i=0;i<selected.length;i++) {
        setProgress((uz?'Tayyorlanmoqda ':'Optimizing ')+(i+1)+' / '+selected.length);
        const result=await optimizeImage(selected[i],kind,aborter.signal);
        next.push(result.file);before+=selected[i].size;after+=result.file.size;
      }
      if(sequence.current===run){onChange(next);setReport({before,after});}
    }catch(e){if(sequence.current===run)setError(e.name==='AbortError'?(uz?'Bekor qilindi.':'Cancelled. Previous selection kept.'):e.message);}
    finally{if(sequence.current===run){setBusy(false);onBusy?.(false);setProgress('');}if(input.current)input.current.value='';}
  }
  const move=(i,d)=>{const next=[...value];[next[i],next[i+d]]=[next[i+d],next[i]];onChange(next);};
  return <div className="image-upload">
    <div className={'image-dropzone '+(drag?'dragging':'')} onDragOver={e=>{e.preventDefault();if(!busy)setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);if(!busy)choose(e.dataTransfer.files);}}>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" multiple={kind!=='cover'} hidden onChange={e=>choose(e.target.files)}/>
      <button type="button" disabled={busy} onClick={()=>input.current.click()}><Upload size={22}/><strong>{kind==='cover'?(uz?'Muqova tanlash':'Choose cover'):(uz?'Rasmlarni tanlash':'Choose images')}</strong><span>{uz?'JPG, PNG, WebP · Avtomatik siqish':'JPG, PNG, WebP · Automatically optimized'}</span></button>
    </div>
    {busy&&<div className="upload-progress" role="status"><span>{progress}</span><button type="button" onClick={()=>controller.current?.abort()}>{uz?'Bekor qilish':'Cancel'}</button></div>}
    {error&&<p className="upload-error" role="alert">{error}</p>}
    {report&&<p className="upload-report" role="status">{bytes(report.before)} → {bytes(report.after)} · {uz?'Tayyor':'Ready'}</p>}
    <div className="upload-previews">{!value.length&&existing.filter(Boolean).map((src,i)=><div className="upload-preview" key={i}><img src={src} alt={'Current image '+(i+1)}/><small>{uz?'Hozirgi rasm':'Current image'}</small></div>)}{value.map((file,i)=><div className="upload-preview" key={file.name+'-'+i}><FilePreview file={file}/><small title={file.name}>{file.name}</small><small>{bytes(file.size)}</small><div>{kind!=='cover'&&<><button type="button" aria-label={'Move image '+(i+1)+' left'} disabled={busy||i===0} onClick={()=>move(i,-1)}><ArrowLeft size={14}/></button><button type="button" aria-label={'Move image '+(i+1)+' right'} disabled={busy||i===value.length-1} onClick={()=>move(i,1)}><ArrowRight size={14}/></button></>}<button type="button" aria-label={'Remove image '+(i+1)} disabled={busy} onClick={()=>onChange(value.filter((_,j)=>j!==i))}><X size={14}/></button></div></div>)}</div>
  </div>;
}
