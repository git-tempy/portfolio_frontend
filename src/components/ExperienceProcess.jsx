import { useEffect, useRef, useState } from 'react';
import './ExperienceProcess.css';

export default function ExperienceProcess({job}) {
  const ref=useRef(null),[visible,setVisible]=useState(false);
  const role=[job.role_en,job.role_uz,job.role_ru,job.role_jp,job.role].filter(Boolean).join(' ');
  const company=[job.company_en,job.company_uz,job.company_ru,job.company].filter(Boolean).join(' ');
  const type=/textbook|kitob|учебник|教科書/i.test(role)?'textbook':/freelance|frilans|фриланс|フリーランス/i.test(role+' '+company)?'freelance':'university';
  useEffect(()=>{
    const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.1});
    observer.observe(ref.current);return()=>observer.disconnect();
  },[]);
  return <span ref={ref} aria-hidden="true" className={'experience-process '+(visible?'is-visible':'')} style={{backgroundImage:`url(/images/process/${type}.webp)`,aspectRatio:type==='freelance'?'1':'1.09'}}/>;
}
