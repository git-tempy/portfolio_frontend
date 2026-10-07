import {useEffect,useRef,useState} from 'react';
import './ExperienceProcess.css';
export default function ExperienceProcess({job}) {
 const ref=useRef(null),[visible,setVisible]=useState(false),[hidden,setHidden]=useState(document.hidden),[reduced,setReduced]=useState(false),[index,setIndex]=useState(0);
 const frames=job.animation_frames||[],signature=frames.map(frame=>frame.image).join('|');
 const interval=Math.max(50,Math.min(5000,Number(job.animation_interval)||700));
 const role=[job.role_en,job.role_uz,job.role_ru,job.role_jp,job.role].filter(Boolean).join(' ');
 const company=[job.company_en,job.company_uz,job.company_ru,job.company].filter(Boolean).join(' ');
 const type=/textbook|kitob|учебник|教科書/i.test(role)?'textbook':/freelance|frilans|фриланс|フリーランス/i.test(role+' '+company)?'freelance':'university';
 useEffect(()=>{const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.1});if(ref.current)observer.observe(ref.current);return()=>observer.disconnect();},[]);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)'),update=()=>setReduced(media.matches),change=()=>setHidden(document.hidden);update();media.addEventListener('change',update);document.addEventListener('visibilitychange',change);return()=>{media.removeEventListener('change',update);document.removeEventListener('visibilitychange',change);};},[]);
 useEffect(()=>{if(frames.length<2||!visible||hidden||reduced)return;const timer=setInterval(()=>setIndex(value=>(value+1)%frames.length),interval);return()=>clearInterval(timer);},[signature,frames.length,visible,hidden,reduced,interval]);
 const running=visible&&!hidden&&!reduced,active=reduced?0:index%Math.max(1,frames.length);
 return <span ref={ref} aria-hidden="true" className={'experience-process '+(running?'is-visible ':'')+(frames.length?'experience-custom-frames':'')} style={frames.length?{aspectRatio:'1'}:{backgroundImage:`url(/images/process/${type}.webp)`,aspectRatio:type==='freelance'?'1':'1.09'}}>{frames.length>0&&frames.map((frame,i)=>(visible||i===active)&&<img key={frame.id||frame.image} src={frame.image} alt="" className={i===active?'is-active':''} loading={visible?'eager':'lazy'} decoding="async"/>)}</span>;
}
