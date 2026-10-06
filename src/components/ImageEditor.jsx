import { useEffect, useRef, useState, useId } from 'react';
import { cropRectangle } from '../lib/cropImage';
import { imageDimensions } from '../lib/imageSizing';

const labels={
  UZ:['Rasmni tahrirlash','Kadr nisbati','Asl format','Kvadrat','Portret','Muqova','Yaqinlashtirish','Gorizontal joylashuv','Vertikal joylashuv','Tiklash','Bekor qilish','Qo‘llash','Tayyorlanmoqda…','Natija'],
  ENG:['Edit image','Aspect ratio','Original','Square','Portrait','Cover','Zoom','Horizontal position','Vertical position','Reset','Cancel','Apply','Processing…','Result'],
  RU:['Редактировать изображение','Соотношение сторон','Оригинал','Квадрат','Портрет','Обложка','Масштаб','По горизонтали','По вертикали','Сбросить','Отмена','Применить','Обработка…','Результат'],
  JP:['画像を編集','縦横比','元の比率','正方形','縦長','カバー','拡大','横位置','縦位置','リセット','キャンセル','適用','処理中…','結果'],
};

export default function ImageEditor({file,kind,language,onApply,onCancel}) {
  const t=labels[language]||labels.ENG, id=useId(), canvas=useRef(null), drag=useRef(null);
  const [bitmap,setBitmap]=useState(null),[ratio,setRatio]=useState(kind==='portrait'?'1':'original');
  const [zoom,setZoom]=useState(1),[x,setX]=useState(50),[y,setY]=useState(50),[busy,setBusy]=useState(false),[error,setError]=useState('');
  useEffect(()=>{
    let active=true, loaded;
    createImageBitmap(file,{imageOrientation:'from-image'}).then(image=>{
      loaded=image;if(active)setBitmap(image);else image.close();
    }).catch(e=>{if(active)setError(e.message);});
    return()=>{active=false;loaded?.close();};
  },[file]);
  const [dragging,setDragging]=useState(false);
  const hint=({UZ:'Rasmni sichqoncha yoki barmoq bilan surib, ramkaga moslang.',ENG:'Drag the image with your mouse or finger to position it in the frame.',RU:'Перетаскивайте изображение мышью или пальцем внутри рамки.',JP:'画像をマウスや指でドラッグして枠内に配置します。'})[language]||'Drag the image to position it.';
  const zoomLabels=({UZ:['Kichraytirish','Kattalashtirish'],ENG:['Zoom out','Zoom in'],RU:['Уменьшить','Увеличить'],JP:['縮小','拡大']})[language]||['Zoom out','Zoom in'];
  const aspect=ratio==='original'?(bitmap?.width/bitmap?.height||1):Number(ratio);
  useEffect(()=>{
    if(!bitmap||!canvas.current)return;
    const c=canvas.current;c.width=Math.round(Math.min(600,600*aspect));c.height=Math.round(c.width/aspect);
    const {sx,sy,sw,sh}=cropRectangle(bitmap.width,bitmap.height,aspect,zoom,x,y);
    const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);ctx.drawImage(bitmap,sx,sy,sw,sh,0,0,c.width,c.height);
  },[bitmap,aspect,zoom,x,y]);
  const clamp=value=>Math.max(0,Math.min(100,value));
  function startDrag(event){
    if(!bitmap||busy||drag.current||event.button!==0)return;
    const rect=event.currentTarget.getBoundingClientRect();
    const crop=cropRectangle(bitmap.width,bitmap.height,aspect,zoom,x,y);
    drag.current={pointer:event.pointerId,startX:event.clientX,startY:event.clientY,x,y,crop,rect};
    event.currentTarget.setPointerCapture(event.pointerId);setDragging(true);
  }
  function moveDrag(event){
    const start=drag.current;if(!start||start.pointer!==event.pointerId)return;
    const availableX=bitmap.width-start.crop.sw,availableY=bitmap.height-start.crop.sh;
    if(availableX>0)setX(clamp(start.x-(event.clientX-start.startX)*start.crop.sw/start.rect.width/availableX*100));
    if(availableY>0)setY(clamp(start.y-(event.clientY-start.startY)*start.crop.sh/start.rect.height/availableY*100));
  }
  function endDrag(event){
    if(drag.current?.pointer!==event.pointerId)return;
    drag.current=null;setDragging(false);
    if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);
  }
  async function apply(){
    setBusy(true);setError('');
    try {
      const {sx,sy,sw,sh}=cropRectangle(bitmap.width,bitmap.height,aspect,zoom,x,y);
      const dimensions=imageDimensions(sw,sh,kind==='portrait'?'cover':kind);
      const c=document.createElement('canvas');c.width=dimensions.width;c.height=dimensions.height;
      c.getContext('2d').drawImage(bitmap,sx,sy,sw,sh,0,0,c.width,c.height);
      const blob=await new Promise(resolve=>c.toBlob(resolve,'image/webp',.9));
      if(!blob)throw new Error('Could not process image.');
      await onApply(new File([blob],file.name.replace(/\.[^.]+$/,'')+'-edited.webp',{type:'image/webp'}));
    }catch(e){setError(e.message);}finally{setBusy(false);}
  }
  return <section className="image-editor" aria-label={t[0]} aria-busy={busy}>
    <h4>{t[0]}</h4>
    <label htmlFor={id+'-ratio'}>{t[1]}</label><select id={id+'-ratio'} value={ratio} disabled={busy} onChange={e=>{setRatio(e.target.value);setZoom(1);setX(50);setY(50);}}>
      <option value="original">{t[2]}</option><option value="1">1:1 · {t[3]}</option><option value="0.75">3:4 · {t[4]}</option><option value="1.25">5:4 · {t[5]}</option><option value="1.7777777778">16:9</option>
    </select>
    <p className="image-editor-hint" id={id+'-hint'}>{hint}</p>
    <div className="image-editor-stage"><div className={'image-crop-frame'+(dragging?' is-dragging':'')}><canvas ref={canvas} aria-label={t[13]} aria-describedby={id+'-hint'} tabIndex={busy?-1:0} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={()=>{drag.current=null;setDragging(false);}} onKeyDown={event=>{if(busy)return;const directions={ArrowLeft:[2,0],ArrowRight:[-2,0],ArrowUp:[0,2],ArrowDown:[0,-2]};const d=directions[event.key];if(d){event.preventDefault();setX(v=>clamp(v+d[0]));setY(v=>clamp(v+d[1]));}}}/><div className="crop-frame-grid" aria-hidden="true"/></div></div>
    <div className="image-zoom-controls"><button type="button" aria-label={zoomLabels[0]} disabled={!bitmap||busy||zoom<=1} onClick={()=>setZoom(v=>Math.max(1,Number((v-.1).toFixed(2))))}>−</button><label className="image-editor-slider" htmlFor={id+'-zoom'}><span>{t[6]}<output>{zoom.toFixed(2)}×</output></span><input id={id+'-zoom'} type="range" min="1" max="4" step="0.01" value={zoom} disabled={!bitmap||busy} onChange={e=>setZoom(Number(e.target.value))}/></label><button type="button" aria-label={zoomLabels[1]} disabled={!bitmap||busy||zoom>=4} onClick={()=>setZoom(v=>Math.min(4,Number((v+.1).toFixed(2))))}>+</button></div>
    {error&&<p role="alert" className="upload-error">{error}</p>}
    <div className="image-editor-actions"><button type="button" disabled={busy} onClick={()=>{setZoom(1);setX(50);setY(50);}}>{t[9]}</button><button type="button" disabled={busy} onClick={onCancel}>{t[10]}</button><button type="button" disabled={!bitmap||busy} onClick={apply}>{busy?t[12]:t[11]}</button></div>
  </section>;
}
