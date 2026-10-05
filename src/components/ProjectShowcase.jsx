import {useEffect,useRef,useState,useId} from 'react';
import {LayoutGroup,motion,useReducedMotion} from 'framer-motion';
import {X} from 'lucide-react';
import {localized} from '../lib/content';
import {textFor} from '../lib/uiText';
import './ProjectShowcase.css';
export default function FocusShowcase({project,language,onClose}){
 const ref=useRef(null),touch=useRef(null),reduce=useReducedMotion(),group=useId();
 const [index,setIndex]=useState(0),[ratios,setRatios]=useState({});
 const items=project.images||[],t=textFor(language),title=localized(project,'title',language);
 const fallbackRatio=project.aspectRatio||(project.type==='pdf'?16/9:.8);
 const ratio=ratios[index]||fallbackRatio, mainWidth=items.length>1?.73:1;
 const others=items.map((_,i)=>i).filter(i=>i!==index);
 useEffect(()=>{const previous=document.activeElement,overflow=document.body.style.overflow;ref.current.showModal();document.body.style.overflow='hidden';return()=>{document.body.style.overflow=overflow;previous?.focus();};},[]);
 const change=delta=>{if(items.length)setIndex(i=>(i+delta+items.length)%items.length);};
 const tile=(i,main)=>{
  const item=items[i];
  return <motion.button layout layoutId={'slide-'+i} key={item.image} className={'animos-focus-tile'+(main?' is-main':'')} transition={{layout:{duration:reduce?0:.65,ease:[.22,.8,.25,1]}}} style={{aspectRatio:ratios[i]||fallbackRatio}} onClick={()=>setIndex(i)} aria-label={t.image+' '+(i+1)} aria-pressed={main}>
   <img src={item.preview||item.image} alt={title+' / '+(i+1)} draggable="false" onLoad={e=>{const next=e.currentTarget.naturalWidth/e.currentTarget.naturalHeight;setRatios(old=>old[i]===next?old:{...old,[i]:next});}}/>
  </motion.button>;
 };
 return <dialog ref={ref} className="animos-focus-dialog intrinsic-focus-dialog" style={{'--focus-ratio':ratio/mainWidth}} aria-label={title} onCancel={e=>{e.preventDefault();onClose();}} onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();change(1);}if(e.key==='ArrowLeft'){e.preventDefault();change(-1);}}}>
  <header><h2>{title}</h2><button autoFocus aria-label={t.close} onClick={onClose}><X/></button></header>
  <LayoutGroup id={group}><div className="animos-focus-stage intrinsic-focus-stage" style={{aspectRatio:ratio/mainWidth,'--image-ratio':ratio}}>
   <div className="focus-main-slot" style={{width:(mainWidth*100)+'%', '--image-ratio':ratio}} onTouchStart={e=>{touch.current={x:e.touches[0].clientX,y:e.touches[0].clientY};}} onTouchEnd={e=>{if(!touch.current)return;const dx=e.changedTouches[0].clientX-touch.current.x,dy=e.changedTouches[0].clientY-touch.current.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3)change(dx<0?1:-1);touch.current=null;}}>{items.length>0&&tile(index,true)}</div>
   <div className="focus-scroll-rail" aria-label={t.gallery}>{others.map(i=>tile(i,false))}</div>
  </div></LayoutGroup>
 </dialog>;
}
