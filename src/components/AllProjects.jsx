import { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { useContent, localized, categoryLabel } from '../lib/content';
import ContentState from './ContentState';
import ProjectCard from './ProjectCard';
export default function AllProjects({ language, initialSearch = '', onBack }) {
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState(12);
  const state = useContent('/api/portfolio/projects/', language);
  const projects = Array.isArray(state.data) ? state.data : [];
  const filtered = projects.filter(p => (!category || p.category === category) && [localized(p,'title',language),localized(p,'description',language),p.main_hashtag,p.regular_hashtags].join(' ').toLowerCase().includes(search.toLowerCase()));
  const categories = [...new Set(projects.map(p => p.category).filter(Boolean))];
  return <section className="section catalog"><div className="container"><button className="text-button" onClick={onBack}><ArrowLeft size={18}/>{language === 'UZ' ? 'Bosh sahifa' : 'Back home'}</button><div className="section-heading"><div><span className="eyebrow">DESONE / {language === 'UZ' ? 'ISHLAR' : 'WORK'}</span><h1>Portfolio<span className="accent">.</span></h1></div><span className="muted">{filtered.length} {language === 'UZ' ? 'loyiha' : 'projects'}</span></div>
  <div className="catalog-controls"><label className="search-box"><Search size={19}/><input aria-label="Search projects" placeholder={language === 'UZ' ? 'Loyihalarni qidirish…' : 'Search projects…'} value={search} onChange={e => { setSearch(e.target.value); setLimit(12); }}/></label><div className="filter-list" aria-label="Project categories">{['',...categories].map(c => <button key={c} aria-pressed={category === c} onClick={() => {setCategory(c);setLimit(12);}}>{c ? categoryLabel(c) : language === 'UZ' ? 'Barchasi' : 'All work'}</button>)}</div></div>
  <ContentState state={state} language={language}/>{!state.loading && !state.error && (filtered.length ? <><div className="work-grid">{filtered.slice(0,limit).map(p => <ProjectCard key={p.id} project={p} language={language}/>)}</div>{limit < filtered.length && <button className="button load-more" onClick={() => setLimit(n => n+12)}>{language === 'UZ' ? 'Ko‘proq ko‘rish' : 'Show more'}</button>}</> : <div className="content-state"><p>{language === 'UZ' ? 'Mos loyiha topilmadi.' : 'No projects match your search.'}</p><button className="text-button" onClick={() => {setSearch('');setCategory('');}}>{language === 'UZ' ? 'Filtrlarni tozalash' : 'Clear filters'}</button></div>)}</div></section>;
}
