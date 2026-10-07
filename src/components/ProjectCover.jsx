import {projectCoverImages} from '../lib/projectCovers';
import {useEffect,useRef,useState} from 'react';
export default function ProjectCover({project,title}) {
 const images=projectCoverImages(project);
 const signature=images.join('|'), ref=useRef(null);
 const [index,setIndex]=useState(0),[visible,setVisible]=useState(false),[reduced,setReduced]=useState(false);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(media.matches);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[]);
 useEffect(()=>{const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{rootMargin:'80px'});if(ref.current)observer.observe(ref.current);return()=>observer.disconnect();},[]);
 useEffect(()=>{
  if(images.length<2||!visible||reduced)return;
  let timer;
  const start=()=>{clearInterval(timer);if(!document.hidden)timer=setInterval(()=>setIndex(value=>(value+1)%images.length),5000);};
  start();document.addEventListener('visibilitychange',start);return()=>{clearInterval(timer);document.removeEventListener('visibilitychange',start);};
 },[signature,images.length,visible,reduced]);
 const active=index%Math.max(1,images.length),next=(active+1)%images.length,previous=(active+images.length-1)%images.length;
 return <div className="project-cover-slides" ref={ref}>{images.map((src,i)=>(i===active||(visible&&!reduced&&(i===next||i===previous)))&&<img key={src} src={src} alt={i===active?title:''} aria-hidden={i!==active} className={i===active?'is-active':''} loading="lazy" decoding="async" draggable="false"/>)}{images.length>1&&<span className="project-cover-count" aria-label={`${active+1} / ${images.length}`}>{active+1} / {images.length}</span>}</div>;
}
