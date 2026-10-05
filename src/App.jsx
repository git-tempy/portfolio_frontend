import { clearAdminToken, getAdminToken } from './lib/adminApi';
import { lazy, Suspense, useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import { AboutSection, EducationSection, CertificatesSection, SkillsSection, ExperienceSection } from './components/ContentSections';
import Portfolio from './components/Portfolio';

import {textFor} from './lib/uiText';
import Contact from './components/Contact';
import AllProjects from './components/AllProjects';
import AdminLogin from './components/AdminLogin';
import { useContent, navigate } from './lib/content';
import { supportedLanguage, resolveLanguage } from './lib/language';
import { recordVisit } from './lib/visitorAnalytics';
import './public.css';
import './reference.css';
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const ProjectDetailModal = lazy(() => import('./components/ProjectDetailModal'));
const ResumeModal = lazy(() => import('./components/ResumeModal'));

const readSetting = (key, fallback) => { try { return localStorage.getItem(key)||fallback; } catch { return fallback; } };
// Every fresh visit starts in the device language; manual choices last for this visit.
const readLanguage = () => supportedLanguage(new URLSearchParams(location.search).get('lang'))||resolveLanguage({deviceLanguages:navigator.languages?.length?navigator.languages:[navigator.language]});
export default function App() {
  const [language,setLanguage]=useState(readLanguage);
  const chooseLanguage = value => {
    setLanguage(value);
    const url=new URL(location.href);url.searchParams.set('lang',value);history.replaceState(history.state,'',url);
  };
  const [theme,setTheme]=useState(()=>readSetting('theme','dark')==='light'?'light':'dark');
  const [route,setRoute]=useState(()=>location.pathname);
  const [query,setQuery]=useState(()=>location.search);
  const [search,setSearch]=useState('');
  const [authenticated,setAuthenticated]=useState(()=>Boolean(getAdminToken()));
  const [resume,setResume]=useState(false);
  const about=useContent('/api/about/',language);
  const isAdmin=route==='/desone_adminstration';
  useEffect(() => {
    if (!isAdmin && import.meta.env.PROD) recordVisit(window.API_BASE_URL);
  }, [isAdmin]);

  const selected=route.startsWith('/portfolio/')?decodeURIComponent(route.slice(11)):null;
  useEffect(()=>{
    const change=()=>{setRoute(location.pathname);setQuery(location.search);};
    addEventListener('popstate',change);
    return()=>removeEventListener('popstate',change);
  },[]);
  useEffect(()=>{
    document.documentElement.dataset.theme=theme;
    document.documentElement.lang={ENG:'en',UZ:'uz',RU:'ru',JP:'ja'}[language];
    document.title='desone | '+({UZ:'Grafik va raqamli dizayner',ENG:'Graphic & Digital Designer',RU:'Графический и цифровой дизайнер',JP:'グラフィック＆デジタルデザイナー'})[language];
    try {localStorage.setItem('theme',theme);} catch { /* Storage may be disabled. */ }
  },[theme,language]);
  useEffect(()=>{
    const url=new URL(location.href);url.searchParams.set('lang',language);history.replaceState(history.state,'',url);
  },[language,route]);
  useEffect(()=>{
    if(selected) return;
    if(Number.isFinite(history.state?.scrollY)) requestAnimationFrame(()=>window.scrollTo(0,history.state.scrollY));
    else if(location.hash) requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView());
    else window.scrollTo(0,0);
  },[route,selected]);
  const catalogQuery=selected&&history.state?.from?.startsWith('/portfolio?')?history.state.from.split('?')[1].split('#')[0]:query;
  const catalogTag=new URLSearchParams(catalogQuery).get('tag')||'';
  const closeProject=()=>history.state?.from ? history.back() : navigate('/portfolio?lang='+language);
  return <>

    {isAdmin&&!authenticated&&<button className="admin-theme-toggle" onClick={()=>setTheme(t=>t==='dark'?'light':'dark')}>{theme==='dark'?textFor(language).light:textFor(language).dark}</button>}
    <div className="ambient-glows" aria-hidden="true"><div className="glow-orb glow-lime"/><div className="glow-orb glow-blue"/><div className="glow-orb glow-amber"/></div>
    {!isAdmin&&<Navbar view={route} language={language} setLanguage={chooseLanguage} theme={theme} toggleTheme={()=>setTheme(t=>t==='dark'?'light':'dark')} onResumeClick={()=>setResume(true)}/>}
    {isAdmin?<Suspense fallback={<div className="page-loading" role="status">{textFor(language).loading}</div>}>{authenticated?<AdminDashboard theme={theme} toggleTheme={()=>setTheme(t=>t==='dark'?'light':'dark')} setLanguage={chooseLanguage} language={language} onLogout={()=>{clearAdminToken();setAuthenticated(false);navigate('/');}} dbAbout={about.data} onAboutUpdate={about.retry}/>:<AdminLogin language={language} onLoginSuccess={()=>setAuthenticated(true)} onBack={()=>navigate('/')}/>}</Suspense>:<><main id="main-content">{(route==='/portfolio'||(selected&&history.state?.from?.startsWith('/portfolio?')))?<AllProjects key={search+catalogTag} language={language} initialSearch={search} initialTag={catalogTag} onBack={()=>navigate('/?lang='+language)}/>:<><Hero language={language}/><AboutSection language={language} state={about}/><EducationSection language={language}/><CertificatesSection language={language}/><SkillsSection language={language}/><ExperienceSection language={language}/><Portfolio language={language} onViewAll={term=>{setSearch(term||'');navigate('/portfolio?lang='+language);}}/><Contact language={language}/></>}</main><footer className="site-footer container"><a className="brand" href="/"><span>des</span>one.</a><span>© {new Date().getFullYear()} DesOne</span><a href="#home">{textFor(language).top} ↑</a></footer></>}
    <Suspense fallback={<div className="page-loading" role="status">{textFor(language).loading}</div>}>{selected&&<ProjectDetailModal key={selected} projectId={selected} language={language} onClose={closeProject}/>} {resume&&<ResumeModal language={language} aboutState={about} onClose={()=>setResume(false)}/>}</Suspense>
  </>;
}


