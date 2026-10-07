import { useEffect, useRef, useState } from 'react';
import { Upload, X, ArrowLeft, ArrowRight, Crop } from 'lucide-react';
import { optimizeImage } from '../lib/optimizeImage';
import './ImageUpload.css';
import ImageEditor from './ImageEditor';
import { adminText } from '../lib/adminTranslations';
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
export default function ImageUpload({ value=[],onChange,onBusy,kind='gallery',language='ENG',existing=[],singleImage=false,multipleImages=false }) {
  const input=useRef(null),controller=useRef(null),sequence=useRef(0),busyCallback=useRef(onBusy);
  useEffect(()=>{busyCallback.current=onBusy;},[onBusy]);
  const [busy,setBusy]=useState(false),[error,setError]=useState(''),[progress,setProgress]=useState(''),[report,setReport]=useState(null),[drag,setDrag]=useState(false);
  const [editing,setEditing]=useState(null);
  const single=(kind!=='gallery'&&!multipleImages)||singleImage;
  const actionLabels=({UZ:['Almashtirish','O‘chirish'],ENG:['Replace','Delete'],RU:['Заменить','Удалить'],JP:['変更','削除']})[language]||['Replace','Delete'];
  const orderLabels=({UZ:['Chapga surish','O‘ngga surish'],ENG:['Move left','Move right'],RU:['Сдвинуть влево','Сдвинуть вправо'],JP:['左へ移動','右へ移動']})[language]||['Move left','Move right'];
  const editLabel=({UZ:'Tahrirlash',ENG:'Edit',RU:'Редактировать',JP:'編集'})[language]||'Edit';
  const tr=(uzbek,english)=>adminText(language,uzbek,english);
  useEffect(()=>()=>{sequence.current++;controller.current?.abort();busyCallback.current?.(false);},[]);
  async function choose(files) {
    const chosen=Array.from(files||[]);
    if(!chosen.length)return;
    if(kind==='gallery'&&value.length+chosen.length>20){setError(tr("Bir yuklashda 20 tagacha rasm.","Choose up to 20 images per upload."));return;}
    if(kind==='gallery'&&chosen.reduce((n,f)=>n+f.size,0)>150*1024*1024){setError(tr("Jami fayllar 150 MB dan kichik bo‘lishi kerak.","The selected files must total less than 150 MB."));return;}
    controller.current?.abort();
    const run=++sequence.current, aborter=new AbortController();controller.current=aborter;
    setBusy(true);onBusy?.(true);setError('');setReport(null);
    let before=0,after=0;
    const next=single?[]:[...value];
    try {
      const selected=single?chosen.slice(0,1):chosen;
      for(let i=0;i<selected.length;i++) {
        setProgress((tr("Tayyorlanmoqda ","Optimizing "))+(i+1)+' / '+selected.length);
        const result=await optimizeImage(selected[i],kind,aborter.signal);
        next.push(result.file);before+=selected[i].size;after+=result.file.size;
      }
      if(sequence.current===run){if(single){setEditing({file:next[0],index:0});}else {setEditing({file:next[value.length],index:0,batch:next.slice(value.length),completed:[...value]});onBusy?.(true);}setReport({before,after});}
    }catch(e){if(sequence.current===run){onBusy?.(false);setError(e.name==='AbortError'?(tr("Bekor qilindi.","Cancelled. Previous selection kept.")):e.message);}}
    finally{if(sequence.current===run){setBusy(false);if(aborter.signal.aborted)onBusy?.(false);setProgress('');}if(input.current)input.current.value='';}
  }
  const beginEdit=(file,index)=>{setEditing({file,index});onBusy?.(true);};
  const stopEdit=()=>{setEditing(null);onBusy?.(false);};
  async function editExisting(src){
    controller.current?.abort();const aborter=new AbortController();controller.current=aborter;
    const run=++sequence.current;setBusy(true);onBusy?.(true);setProgress(tr('Rasm ochilmoqda…','Loading image…'));setError('');
    try {
      const source=new URL(src,location.href);
      const previewOrigin=import.meta.env.DEV&&import.meta.env.VITE_PREVIEW_MEDIA_ORIGIN;
      const storageSource=source.protocol==='https:'&&source.hostname==='br-cold-sun-b1ney4xj.storage.c-5.eu-central-1.aws.neon.tech'&&source.pathname.startsWith('/portfolio-media/uploads/');
      const mediaUrl=previewOrigin&&source.origin===previewOrigin?'/__preview-media'+source.pathname+source.search:storageSource&&!import.meta.env.DEV?'/api/image-source?url='+encodeURIComponent(source.href):src;
      const response=await fetch(mediaUrl,{signal:aborter.signal});
      if(!response.ok)throw new Error('Could not load image.');
      const blob=await response.blob();
      const suffix=source.protocol==='data:'?'webp':source.pathname.split('.').pop()?.toLowerCase();
      const extension=['jpg','jpeg','png','webp'].includes(suffix)?suffix:'webp';
      const mime=['image/jpeg','image/png','image/webp'].includes(blob.type)?blob.type:({jpg:'image/jpeg',jpeg:'image/jpeg',png:'image/png',webp:'image/webp'})[extension];
      const result=await optimizeImage(new File([blob],'current-image.'+(extension||'png'),{type:mime||blob.type}),kind,aborter.signal);
      if(run===sequence.current){setEditing({file:result.file,index:0});}
    }catch{if(run===sequence.current){setError(({UZ:'Rasmni ochib bo‘lmadi. Qayta tanlang.',RU:'Не удалось открыть изображение. Выберите файл повторно.',ENG:'Could not open image. Please select the file again.',JP:'画像を開けません。ファイルを再選択してください。'})[language]);onBusy?.(false);}}
    finally{if(run===sequence.current){setBusy(false);setProgress('');}}
  }
  const move=(i,d)=>{const next=[...value];[next[i],next[i+d]]=[next[i+d],next[i]];onChange(next);};
  return <div className="image-upload">
    <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" multiple={!single} hidden onChange={e=>choose(e.target.files)}/>
    {(!single||(!value.length&&!existing.some(Boolean)))&&<div className={'image-dropzone '+(drag?'dragging':'')} onDragOver={e=>{e.preventDefault();if(!busy&&!editing)setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);if(!busy&&!editing)choose(e.dataTransfer.files);}}>
      <button type="button" disabled={busy||!!editing} onClick={()=>input.current.click()}><Upload size={22}/><strong>{kind==='portrait'?(tr("Profil rasmini tanlash","Choose profile image")):kind==='icon'?(tr("Rasmni tanlash","Choose image")):(single||kind==='cover')?(tr("Muqova tanlash","Choose cover")):(tr("Rasmlarni tanlash","Choose images"))}</strong><span>{tr("JPG, PNG, WebP · Avtomatik siqish","JPG, PNG, WebP · Automatically optimized")}</span></button>
    </div>}
    {editing&&<ImageEditor key={editing.file.name+'-'+editing.index} file={editing.file} kind={kind} language={language} onCancel={stopEdit} onApply={file=>{if(editing.batch){const completed=[...editing.completed,file],index=editing.index+1;if(index<editing.batch.length){setEditing({...editing,file:editing.batch[index],index,completed});return;}onChange(completed);}else {const next=single?[file]:value.map((item,i)=>i===editing.index?file:item);onChange(next);}setReport(null);stopEdit();}}/>}
    {busy&&<div className="upload-progress" role="status"><span>{progress}</span><button type="button" onClick={()=>controller.current?.abort()}>{tr("Bekor qilish","Cancel")}</button></div>}
    {error&&<p className="upload-error" role="alert">{error}</p>}
    {report&&<p className="upload-report" role="status">{bytes(report.before)} → {bytes(report.after)} · {tr("Tayyor","Ready")}</p>}
    <div className={single?"upload-previews single-image-preview":"upload-previews gallery-upload-previews"}>{!value.length&&existing.filter(Boolean).map((src,i)=><div className="upload-preview" key={i}><img src={src} alt={tr('Hozirgi rasm','Current image')+' '+(i+1)}/><small>{tr("Hozirgi rasm","Current image")}</small>{single&&<div className="single-image-actions"><button type="button" disabled={busy||!!editing} onClick={()=>editExisting(src)}><Crop size={14}/>{editLabel}</button><button type="button" disabled={busy||!!editing} onClick={()=>input.current.click()}>{actionLabels[0]}</button><button type="button" disabled={busy||!!editing} onClick={()=>onChange([])}>{actionLabels[1]}</button></div>}</div>)}{value.map((file,i)=><div className="upload-preview" key={file.name+'-'+i}><FilePreview file={file}/><small title={file.name}>{file.name}</small><small>{bytes(file.size)}</small><div className={single?"single-image-actions":"gallery-upload-actions"}><button type="button" aria-label={editLabel+" "+(i+1)} disabled={busy||!!editing} onClick={()=>beginEdit(file,i)}><Crop size={14}/>{editLabel}</button>{single&&<button type="button" disabled={busy||!!editing} onClick={()=>input.current.click()}>{actionLabels[0]}</button>}{!single&&<><button type="button" aria-label={orderLabels[0]+' '+(i+1)} disabled={busy||!!editing||i===0} onClick={()=>move(i,-1)}><ArrowLeft size={14}/>{orderLabels[0]}</button><button type="button" aria-label={orderLabels[1]+' '+(i+1)} disabled={busy||!!editing||i===value.length-1} onClick={()=>move(i,1)}><ArrowRight size={14}/>{orderLabels[1]}</button></>}<button type="button" aria-label={actionLabels[1]+' '+(i+1)} disabled={busy||!!editing} onClick={()=>onChange(value.filter((_,j)=>j!==i))}><X size={14}/>{actionLabels[1]}</button></div></div>)}</div>
  </div>;
}
