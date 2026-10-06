import { matchesCategory } from '../lib/projectCategories';
import {textFor} from '../lib/uiText';
import { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { useContent, localized, categoryLabel, navigate } from '../lib/content';
import ContentState from './ContentState';
import ProjectCard from './ProjectCard';
import {hasProjectTag} from '../lib/projectTags';
export default function AllProjects({ language, initialSearch = '', initialTag = '', onBack }) {
  const diplomaView = new URLSearchParams(window.location.search).get('context') === 'diploma' || initialTag.toLowerCase().replace(/^#/, '') === 'noq';
  const heading = diplomaView ? ({UZ:'Diplom ishi',RU:'Дипломная работа',ENG:'Graduation project',JP:'卒業制作'}[language] || 'Graduation project') : textFor(language).portfolio;
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState(12);
  const state = useContent('/api/portfolio/projects/', language);
  const categoryState = useContent('/api/portfolio/categories/', language);
  const categories = Array.isArray(categoryState.data) ? categoryState.data : [];
  const selectedCategory = categories.find(c => String(c.id) === category);
  const projects = Array.isArray(state.data) ? state.data : [];
  const filtered = projects.filter(p => (!initialTag || hasProjectTag(p,initialTag)) && matchesCategory(p, selectedCategory) && [localized(p,'title',language),localized(p,'description',language),p.main_hashtag,p.regular_hashtags].join(' ').toLowerCase().includes(search.toLowerCase()));
  return <section className="section catalog"><div className="container"><button className="text-button" onClick={onBack}><ArrowLeft size={18}/>{textFor(language).home}</button><div className="section-heading"><div><span className="eyebrow">DESONE / {textFor(language).work}</span><h1>{heading}<span className="accent">.</span></h1></div><span className="muted">{filtered.length} {textFor(language).projects}</span></div>
  <div className="catalog-controls"><label className="search-box"><Search size={19}/><input aria-label={textFor(language).search} placeholder={textFor(language).search} value={search} onChange={e => { setSearch(e.target.value); setLimit(12); }}/></label><div className="filter-list" aria-label={textFor(language).all}>{[null,...categories].map(c => <button key={c?.id ?? 'all'} aria-pressed={c ? category === String(c.id) : !selectedCategory} onClick={() => {setCategory(c ? String(c.id) : '');setLimit(12);}}>{c ? categoryLabel(localized(c,'name',language)) : textFor(language).all}</button>)}</div></div>
  <ContentState state={categoryState} language={language}/><ContentState state={state} language={language}/>{!state.loading && !state.error && (filtered.length ? <><div className="work-grid">{filtered.slice(0,limit).map(p => <ProjectCard key={p.id} project={p} language={language}/>)}</div>{limit < filtered.length && <button className="button load-more" onClick={() => setLimit(n => n+12)}>{textFor(language).more}</button>}</> : <div className="content-state"><p>{textFor(language).noMatches}</p><button className="text-button" onClick={() => {setSearch('');setCategory('');if(initialTag)navigate('/portfolio?lang='+language);}}>{textFor(language).clear}</button></div>)}</div></section>;
}
