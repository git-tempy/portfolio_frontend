
import { useState } from 'react';
import { textFor } from '../lib/uiText';
import { matchesCategory } from '../lib/projectCategories';
import { ArrowUpRight } from 'lucide-react';
import { locales } from '../locales';
import { useContent, localized, categoryLabel } from '../lib/content';
import ContentState from './ContentState';
import ProjectCard from './ProjectCard';
export default function Portfolio({ language, onViewAll }) {
  const state = useContent('/api/portfolio/projects/', language);
  const categoryState = useContent('/api/portfolio/categories/', language);
  const [categoryId, setCategoryId] = useState('');
  const categories = Array.isArray(categoryState.data) ? categoryState.data : [];
  const selectedCategory = categories.find(c => String(c.id) === categoryId);
  const projects = Array.isArray(state.data) ? state.data : [];
  const filtered = projects.filter(p => matchesCategory(p, selectedCategory));
  const t = (locales[language] || locales.ENG).portfolio;
  return <section id="portfolio" className="section portfolio-section"><div className="container"><div className="section-heading"><div><span className="eyebrow">05 / {({UZ:'Portfolio',ENG:'Portfolio',RU:'Портфолио',JP:'ポートフォリオ'})[language]||'Portfolio'}</span><h2>{({UZ:'Loyihalar',ENG:'Projects',RU:'Проекты',JP:'プロジェクト'})[language]||'Projects'}</h2></div><button className="button button-glass" onClick={() => onViewAll('')}>{t.viewAll}<ArrowUpRight size={18}/></button></div><div className="filter-list" aria-label={textFor(language).all}><button aria-pressed={!selectedCategory} onClick={() => setCategoryId('')}>{textFor(language).all}</button>{categories.map(c => <button key={c.id} aria-pressed={categoryId === String(c.id)} onClick={() => setCategoryId(String(c.id))}>{categoryLabel(localized(c,'name',language))}</button>)}</div><ContentState state={categoryState} language={language}/><ContentState state={state} language={language} empty={!filtered.length}/>{!state.loading && !state.error && <div className="work-grid">{filtered.slice(0,6).map(p => <ProjectCard key={p.id} project={p} language={language}/>)}</div>}</div></section>;
}
