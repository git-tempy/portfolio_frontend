import { useContent, localized, categoryLabel } from '../lib/content';
import ProjectShowcase from './ProjectShowcase';
import MediaViewer from './MediaViewer';
import ContentState from './ContentState';
export default function ProjectDetailModal({ projectId, onClose, language = 'ENG' }) {
  const state = useContent('/api/portfolio/projects/' + encodeURIComponent(projectId) + '/', language);
  const project = state.data;
  if(state.loading || state.error) return <MediaViewer title={({UZ:'Loyiha',ENG:'Project',RU:'Проект',JP:'プロジェクト'})[language]} onClose={onClose} language={language}><ContentState state={state} language={language}/></MediaViewer>;
  const images = project?.images?.length ? project.images : project?.type !== 'pdf' && project?.file ? [{image:project.file}] : project?.cover_image ? [{image:project.cover_image}] : [];
  if(images.length) return <ProjectShowcase key={projectId} project={{...project,images}} language={language} onClose={onClose}/>;
  return <MediaViewer fitContent key={projectId} title={localized(project,'title',language)} category={categoryLabel(project?.category)} pdfUrl={project?.type==='pdf'?project.file:null} onClose={onClose} language={language}/>;
}
