import {useEffect,useState} from 'react';
import ExperienceProcess from './ExperienceProcess';
import {animationDraft} from '../lib/animationDraft';
export default function AnimationDraftPreview({frames,interval,language}){
 const [draft,setDraft]=useState([]),[paused,setPaused]=useState(false),[restart,setRestart]=useState(0);
 useEffect(()=>{const {items,dispose}=animationDraft(frames,URL);setDraft(items);return dispose;},[frames]);
 if(!frames.length)return null;
 const labels=({UZ:['Jonli ko‘rinish','Pauza','Davom etish','Boshidan'],RU:['Предпросмотр','Пауза','Продолжить','Сначала'],ENG:['Live preview','Pause','Play','Restart'],JP:['プレビュー','一時停止','再生','最初から']})[language]||['Live preview','Pause','Play','Restart'];
 return <div className="animation-draft-preview"><strong>{labels[0]}</strong><div className="animation-draft-stage"><ExperienceProcess key={restart} job={{animation_frames:draft,animation_interval:interval}} paused={paused}/></div><div className="animation-draft-controls"><button type="button" onClick={()=>setPaused(value=>!value)}>{paused?labels[2]:labels[1]}</button><button type="button" onClick={()=>{setRestart(value=>value+1);setPaused(false);}}>{labels[3]}</button><span>{draft.length} · {Math.max(50,Math.min(5000,Number(interval)||700))} ms</span></div></div>;
}
