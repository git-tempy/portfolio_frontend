import {projectCoverImages} from '../lib/projectCovers';
import {useEffect,useMemo,useRef,useState} from 'react';
import {useVisibleMotion} from '../lib/visibleMotion';
export default function ProjectCover({project,title}) {
 const images=useMemo(()=>projectCoverImages(project),[project.cover_image,project.covers]);
 const signature=images.join('|'), ref=useRef(null);
 const [{index,departing},setSlide]=useState({index:0,departing:null});
 const animate=useVisibleMotion(ref,images.length>1);
 useEffect(()=>{
  if(!animate)return;
  const timer=setInterval(()=>setSlide(value=>({
   departing:value.index%images.length,index:(value.index+1)%images.length
  })),5000);
  return()=>clearInterval(timer);
 },[signature,images.length,animate]);
 useEffect(()=>{
  if(departing===null)return;
  const timer=setTimeout(()=>setSlide(value=>({...value,departing:null})),850);
  return()=>clearTimeout(timer);
 },[departing,index]);
 const active=index%Math.max(1,images.length),next=(active+1)%images.length;
 return <div className="project-cover-slides" ref={ref}>{images.map((src,i)=>(i===active||(animate&&(i===next||i===departing)))&&<img key={src} src={src} alt={i===active?title:''} aria-hidden={i!==active} className={i===active?'is-active':''} loading="lazy" decoding="async" draggable="false"/>)}{images.length>1&&<span className="project-cover-count" aria-label={`${active+1} / ${images.length}`}>{active+1} / {images.length}</span>}</div>;
}
