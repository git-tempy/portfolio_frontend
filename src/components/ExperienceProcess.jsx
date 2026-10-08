import {useEffect,useRef,useState} from 'react';
import './ExperienceProcess.css';
import {experienceAnimationType} from '../lib/experienceAnimation.js';
export default function ExperienceProcess({job,paused=false}) {
 const ref=useRef(null),[visible,setVisible]=useState(false),[hidden,setHidden]=useState(document.hidden),[reduced,setReduced]=useState(false),[index,setIndex]=useState(0);
 const frames=job.animation_frames||[],signature=frames.map(frame=>frame.image).join('|');
 const interval=Math.max(50,Math.min(5000,Number(job.animation_interval)||700));
 const type=experienceAnimationType(job);
 useEffect(()=>{const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.1});if(ref.current)observer.observe(ref.current);return()=>observer.disconnect();},[]);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)'),update=()=>setReduced(media.matches),change=()=>setHidden(document.hidden);update();media.addEventListener('change',update);document.addEventListener('visibilitychange',change);return()=>{media.removeEventListener('change',update);document.removeEventListener('visibilitychange',change);};},[]);
 useEffect(()=>{if(frames.length<2||!visible||hidden||reduced||paused)return;const timer=setInterval(()=>setIndex(value=>(value+1)%frames.length),interval);return()=>clearInterval(timer);},[signature,frames.length,visible,hidden,reduced,interval,paused]);
 const running=visible&&!hidden&&!reduced&&!paused,active=reduced?0:index%Math.max(1,frames.length);
 return <span ref={ref} aria-hidden="true" className={'experience-process '+(running?'is-visible ':'')+(frames.length?'experience-custom-frames':'')} style={frames.length?{aspectRatio:'1'}:{backgroundImage:`url(/images/process/${type}.webp)`,aspectRatio:type==='freelance'?'1':'1.09'}}>{frames.length>0&&frames.map((frame,i)=>(visible||i===active)&&<img key={frame.id||frame.image} src={frame.image} alt="" className={i===active?'is-active':''} loading={visible?'eager':'lazy'} decoding="async"/>)}</span>;
}
