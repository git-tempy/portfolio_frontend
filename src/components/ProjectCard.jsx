import {textFor} from '../lib/uiText';
import { Eye, Image } from 'lucide-react';
import { localized, categoryLabel, navigate } from '../lib/content';
import Reveal from './Reveal';
export default function ProjectCard({ project, language }) {
  const title = localized(project, 'title', language);
  const href = '/portfolio/' + encodeURIComponent(project.slug || project.id) + '?lang=' + language;
  return <Reveal as="article" y={30} className="work-card">
    <a href={href} className="work-card-link" onClick={e => { if (!e.ctrlKey && !e.metaKey && !e.shiftKey) { e.preventDefault(); navigate(href); } }}>
      <div className="work-cover">{project.cover_image ? <img src={project.cover_image} alt={title} loading="lazy" decoding="async" draggable="false" onError={e => { e.currentTarget.hidden = true; }}/>:<Image size={38}/>}<span className="work-open"><Eye size={16}/></span><span className="work-type">{project.type === 'pdf' ? 'PDF' : (project.images?.length > 1 ? project.images.length + (' '+textFor(language).images) : textFor(language).image)}</span></div>
      <div className="work-info"><span className="eyebrow">{categoryLabel(project.category)}</span><h3>{title}</h3><p>{localized(project, 'description', language)}</p></div>
    </a>
  </Reveal>;
}
