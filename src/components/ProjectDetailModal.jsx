import { useContent, localized, categoryLabel } from '../lib/content';
import MediaViewer from './MediaViewer';
import ContentState from './ContentState';
export default function ProjectDetailModal({ projectId, onClose, language = 'ENG' }) {
  const state = useContent('/api/portfolio/projects/' + encodeURIComponent(projectId) + '/', language);
  const project = state.data;
  if(state.loading || state.error) return <MediaViewer title={language==='UZ'?'Loyiha':'Project'} onClose={onClose} language={language}><ContentState state={state} language={language}/></MediaViewer>;
  const images = project?.images?.length ? project.images : project?.type !== 'pdf' && project?.file ? [{image:project.file}] : project?.cover_image ? [{image:project.cover_image}] : [];
  return <MediaViewer key={projectId} title={localized(project,'title',language)} category={categoryLabel(project?.category)} description={localized(project,'description',language)} images={images} pdfUrl={project?.type==='pdf'?project.file:null} onClose={onClose} language={language}/>;
}
