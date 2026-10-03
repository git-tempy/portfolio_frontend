import {textFor} from '../lib/uiText';
import {useState} from 'react';
import ResumeDownloadForm from './ResumeDownloadForm';
import MediaViewer from './MediaViewer';
import ContentState from './ContentState';
import { localized } from '../lib/content';
import { locales } from '../locales';
export default function ResumeModal({ language, onClose, aboutState }) {
  const [showForm,setShowForm]=useState(false);
  const url = aboutState.data?.resume_pdf;
  const title = [localized(aboutState.data,'name',language),(locales[language]||locales.ENG).resume].filter(Boolean).join(' — ');
  return <MediaViewer title={title} category={title} pdfUrl={url} downloadUrl={!aboutState.loading&&!aboutState.error?url:undefined} onDownload={()=>setShowForm(true)} onClose={onClose} language={language}>
    {showForm?<ResumeDownloadForm url={url} language={language}/>:aboutState.loading||aboutState.error ? <ContentState state={aboutState} language={language}/> : !url ? <p className="viewer-message" role="status">{textFor(language).noResume}</p> : null}
  </MediaViewer>;
}

