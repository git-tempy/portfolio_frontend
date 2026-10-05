
import { ArrowUpRight } from 'lucide-react';
import { locales } from '../locales';
import { useContent } from '../lib/content';
import ContentState from './ContentState';
import ProjectCard from './ProjectCard';
export default function Portfolio({ language, onViewAll }) {
  const state = useContent('/api/portfolio/projects/', language);
  const projects = Array.isArray(state.data) ? state.data : [];
  const t = (locales[language] || locales.ENG).portfolio;
  return <section id="portfolio" className="section portfolio-section"><div className="container"><div className="section-heading"><div><span className="eyebrow">05 / {({UZ:'Portfolio',ENG:'Portfolio',RU:'Портфолио',JP:'ポートフォリオ'})[language]||'Portfolio'}</span><h2>{({UZ:'Loyihalar',ENG:'Projects',RU:'Проекты',JP:'プロジェクト'})[language]||'Projects'}</h2></div><button className="button button-glass" onClick={() => onViewAll('')}>{t.viewAll}<ArrowUpRight size={18}/></button></div><ContentState state={state} language={language} empty={!projects.length}/>{!state.loading && !state.error && <div className="work-grid">{projects.slice(0,6).map(p => <ProjectCard key={p.id} project={p} language={language}/>)}</div>}</div></section>;
}
