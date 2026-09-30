import MediaViewer from './MediaViewer';
import ContentState from './ContentState';
import { localized } from '../lib/content';
import { locales } from '../locales';
export default function ResumeModal({ language, onClose, aboutState }) {
  const url = aboutState.data?.resume_pdf;
  const title = [localized(aboutState.data,'name',language),(locales[language]||locales.ENG).resume].filter(Boolean).join(' — ');
  return <MediaViewer title={title} category="DESONE / RESUME" pdfUrl={url} downloadUrl={!aboutState.loading&&!aboutState.error?url:undefined} onClose={onClose} language={language}>
    {aboutState.loading||aboutState.error ? <ContentState state={aboutState} language={language}/> : !url ? <p className="viewer-message" role="status">{language==='UZ'?'Rezyume hali yuklanmagan.':'No résumé has been uploaded yet.'}</p> : null}
  </MediaViewer>;
}
