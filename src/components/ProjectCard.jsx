import { Eye, Image } from 'lucide-react';
import { localized, categoryLabel, navigate } from '../lib/content';
import Reveal from './Reveal';
export default function ProjectCard({ project, language, renderCover, onOpen, coverControls, staticCard=true }) {
  const title = localized(project, 'title', language);
  const href = (project.id==='local-jdu-carousel' ? '/experiments/jdu-carousel' : '/portfolio/' + encodeURIComponent(project.slug || project.id)) + '?lang=' + language;
  const Wrapper=staticCard?'article':Reveal;
  return <Wrapper {...(staticCard?{}:{as:'article',y:30})} className="work-card project-card">
    <a href={href} className="work-card-link" onClick={e => { if (!e.ctrlKey && !e.metaKey && !e.shiftKey) { e.preventDefault(); if(onOpen) onOpen(); else navigate(href); } }}>
      <div className={"work-cover" + (!renderCover && project.cover_image ? " project-image-cover" : "")}>{renderCover ? renderCover : project.cover_image ? <img src={project.cover_image} alt={title} loading="lazy" decoding="async" draggable="false" onError={e => { e.currentTarget.hidden = true; }}/>:<Image size={38}/>}<span className="work-open"><Eye size={16}/></span></div>
      <div className="work-info"><span className="eyebrow">{categoryLabel(project.category)}</span><h3>{title}</h3></div>
    </a>
    {coverControls}
  </Wrapper>;
}
