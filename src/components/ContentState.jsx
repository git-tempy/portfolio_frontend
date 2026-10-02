import {RotateCcw} from 'lucide-react';
import {textFor} from '../lib/uiText';
export default function ContentState({state,language='ENG',empty=false}){const t=textFor(language);if(state.loading)return <div className="content-loading" role="status" aria-label={t.loading}><span/><span/><span/></div>;if(!state.error&&!empty)return null;return <div className="content-state" role="status"><p>{state.error?t.unavailable:t.empty}</p>{state.error&&<button className="text-button" onClick={state.retry}><RotateCcw size={15}/>{t.retry}</button>}</div>;}
