import {createContentCache} from './contentCache';
import { useEffect, useState } from 'react';
import { localPreviewEnabled, localContent } from './localPreview';

export const langCode = language => ({ ENG: 'en', UZ: 'uz', RU: 'ru', JP: 'jp' }[language] || 'en');
export const localized = (item, field, language) => item?.[field + '_' + langCode(language)] || item?.[field] || '';
export const categoryLabel = name => String(name || '').replaceAll('_', ' ').replace(/\bux ui\b/i, 'UX/UI');
export const navigate = url => {
  const from = location.pathname + location.search + location.hash;
  window.history.replaceState({ ...history.state, scrollY: window.scrollY }, '');
  window.history.pushState({ from }, '', url);
  window.dispatchEvent(new PopStateEvent('popstate'));
};
const contentCache=createContentCache();
const mediaRetries=new Map();
export function refreshFailedMedia(path){const previous=mediaRetries.get(path)||0;if(Date.now()-previous<60000)return;mediaRetries.set(path,Date.now());contentCache.clear(path);window.dispatchEvent(new Event('portfolio-content-change'));}
export function invalidateContent(){contentCache.clear();window.dispatchEvent(new Event('portfolio-content-change'));}
function requestContent(path){
 return contentCache.get(path,()=>fetch(window.API_BASE_URL+path+(path.includes('?')?'&':'?')+'lang=en',{signal:AbortSignal.timeout(12000)})
  .then(response=>{if(!response.ok)throw Error('Content unavailable');return response.json();}));
}
export function useContent(path) {
  const [version,setVersion]=useState(0);
  const [state,setState]=useState({data:null,loading:true,error:false,key:''});
  const key=path+version;
  useEffect(()=>{
    const update=()=>setVersion(v=>v+1);
    window.addEventListener('portfolio-content-change',update);
    if(localPreviewEnabled){window.addEventListener('storage',update);window.addEventListener('portfolio-preview-change',update);}
    return()=>{window.removeEventListener('portfolio-content-change',update);window.removeEventListener('storage',update);window.removeEventListener('portfolio-preview-change',update);};
  },[]);
  useEffect(()=>{
    let cancelled=false;
    requestContent(path).then(data=>localContent(path,data)).then(data=>{if(!cancelled)setState({data,loading:false,error:false,key});})
      .catch(()=>{if(!cancelled)setState({data:null,loading:false,error:true,key});});
    return()=>{cancelled=true;};
  },[path,version,key]);
  return {...state,loading:state.key!==key||state.loading,retry:()=>{contentCache.clear(path);setVersion(v=>v+1);}};
}
