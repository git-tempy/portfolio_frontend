import { useEffect, useRef, useState } from 'react';
import { useContent, localized } from '../lib/content';
import { textFor, lifeDate } from '../lib/uiText';
import ContentState from './ContentState';
import './Life.css';
export default function Life({language}){
 const state=useContent('/api/life/',language),items=Array.isArray(state.data)?state.data:[],t=textFor(language),track=useRef(null),[paused,setPaused]=useState(false);
 useEffect(()=>{
  const el=track.current;
  if(!el||items.length<2||paused||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const measure=()=>el.children[items.length]?.offsetLeft-el.children[0]?.offsetLeft;
  let span=measure(),position=el.scrollLeft||span,id,previous;
  if(!span)return;
  const resize=()=>{span=measure();position=Math.min(position,span);};
  const frame=time=>{if(previous){position-=Math.min(time-previous,50)*.018;if(position<=0)position+=span;}el.scrollLeft=position;previous=time;id=requestAnimationFrame(frame);};
  addEventListener('resize',resize);id=requestAnimationFrame(frame);
  return()=>{cancelAnimationFrame(id);removeEventListener('resize',resize);};
 },[items.length,paused]);
 return <section id="life" className="section"><div className="container"><div className="section-heading"><div><span className="eyebrow">06 / {t.lifeLabel}</span><h2>{t.life}</h2></div></div><ContentState state={state} language={language} empty={!items.length}/><div ref={track} className="life-track" tabIndex={0} aria-label={t.life} onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} onFocus={()=>setPaused(true)} onBlur={()=>setPaused(false)} onTouchStart={()=>setPaused(true)}>{[...items,...(items.length>1?items:[])].map((item,index)=><article className="work-card glass life-card" key={item.id+'-'+index} aria-hidden={index>=items.length?true:undefined}>{item.image&&<div className="work-cover"><img src={item.image} alt="" loading="lazy"/></div>}<div className="work-info"><time dateTime={item.date}>{lifeDate(item.date,language)}</time>{item.is_sample&&<span className="life-sample">{t.sample}</span>}<h3>{localized(item,'title',language)}</h3><p>{localized(item,'description',language)}</p></div></article>)}</div></div></section>;
}
