import { useContent, localized, categoryLabel } from '../lib/content';
import ProjectShowcase from './ProjectShowcase';
import MediaViewer from './MediaViewer';
import ContentState from './ContentState';
import {useEffect, useRef} from 'react';
import {X} from 'lucide-react';
import {textFor} from '../lib/uiText';
function ProjectLoading({state,language,onClose}) {
  const ref=useRef(null),t=textFor(language);
  useEffect(()=>{const previous=document.activeElement,overflow=document.body.style.overflow;ref.current.showModal();document.body.style.overflow='hidden';return()=>{document.body.style.overflow=overflow;previous?.focus();};},[]);
  return <dialog ref={ref} className="project-loading-dialog" aria-label={t.loading} onCancel={e=>{e.preventDefault();onClose();}}><button autoFocus className="icon-button" aria-label={t.close} onClick={onClose}><X/></button><ContentState state={state} language={language}/></dialog>;
}
export default function ProjectDetailModal({ projectId, onClose, language = 'ENG' }) {
  const state = useContent('/api/portfolio/projects/' + encodeURIComponent(projectId) + '/', language);
  const project = state.data;
  if(state.loading || state.error) return <ProjectLoading state={state} onClose={onClose} language={language}/>;
  const images = project?.images?.length ? project.images : project?.type !== 'pdf' && project?.file ? [{image:project.file}] : project?.cover_image ? [{image:project.cover_image}] : [];
  if(images.length) return <ProjectShowcase key={projectId} project={{...project,images}} language={language} onClose={onClose}/>;
  return <MediaViewer fitContent key={projectId} title={localized(project,'title',language)} category={categoryLabel(project?.category)} pdfUrl={project?.type==='pdf'?project.file:null} onClose={onClose} language={language}/>;
}
