import Services from './Services';
import { useState } from 'react';
import { ArrowUpRight, GraduationCap, Plus, Minus, Award, Briefcase, Users, Target, ScanSearch, Brain, Lightbulb, Clock, ListChecks, Coffee, Headphones } from 'lucide-react';
import {textFor,localizedPeriod} from '../lib/uiText';
import { locales } from '../locales';
import { useContent, localized } from '../lib/content';
import ContentState from './ContentState';
import MediaViewer from './MediaViewer';
import Reveal from './Reveal';
import ExperienceProcess from './ExperienceProcess';
import SubsectionTitle from './SubsectionTitle';
import EducationLinks from './EducationLinks';

function TraitIcon({trait}) {
 const text=(trait.text_en||trait.text||'').toLowerCase();
 const Icon=text.includes('team')?Users:text.includes('independent')?Target:text.includes('detail')?ScanSearch:text.includes('critical')?Brain:text.includes('creativ')?Lightbulb:text.includes('time management')?Clock:text.includes('perfection')?ListChecks:text.includes('coffee')?Coffee:text.includes('music')?Headphones:Lightbulb;
 return <Icon size={22} strokeWidth={1.7} aria-hidden="true"/>;
}
const aboutQuote = {
 UZ: { body: 'Ayni paytda dizaynerlar, ayniqsa frilanserlar, bir holatga ko‘p duch kelishadi: soatlab mehnat qilib yaratgan dizaynini ko‘rsatishsa, «Bu AI’da qilingan-ku», degan gapni eshitishadi. Aslida, AI — faqat vosita. U ishni tezlashtirishi va unumdorlikni oshirishi mumkin.', ending: 'lekin, hikoyani asl mohiyatini faqatgina dizayner ifodalab beradi.' },
 ENG: { body: 'Nowadays, designers — especially freelancers — often spend hours on a design, only to hear, “This was made with AI.” AI is a tool. It can speed up the work and improve productivity.', ending: 'But only the designer can express the true essence of the story.' },
 RU: { body: 'В наши дни дизайнеры, особенно фрилансеры, часто сталкиваются с одной ситуацией: показывают работу, на которую потратили часы, и слышат: «Это же сделано в ИИ». ИИ — лишь инструмент. Он может ускорить работу и повысить продуктивность.', ending: 'Но только дизайнер может передать истинную суть истории.' },
 JP: { body: '近年、デザイナー、とりわけフリーランスは、何時間もかけて制作したデザインに「AIで作ったんでしょう」と言われることがあります。AIはあくまで道具です。作業を速め、生産性を高めることはできます。', ending: 'けれど、物語の本質を表現できるのは、デザイナーだけです。' }
};

function SectionTitle({ index, label, title }) { return <div className="section-heading"><div><span className="eyebrow">{index} / {label}</span><h2>{title}</h2></div></div>; }
export function AboutSection({ language, state }) {
  const about=state.data, name=localized(about,'name',language).replace(/feruzxon/gi,'Feruzxon'), bio=localized(about,'bio',language);
  const hasContent=Boolean(name||bio||about?.image);
  const quote=aboutQuote[language]||aboutQuote.ENG;
  return <section className="section about-section" id="about"><div className="container">
    <ContentState state={state} language={language} empty={!hasContent}/>
    {!state.loading&&!state.error&&hasContent&&<div className={'about-layout'+(!about?.image?' about-text-only':'')}>
      {about?.image&&<Reveal x={-30} y={0} duration={.7} amount={.3} className="portrait-glass"><img src={about.image} alt={name} loading="lazy" decoding="async"/></Reveal>}
      <Reveal x={30} y={0} duration={.7} delay={.1} amount={.3} className="about-copy"><span className="eyebrow">01 / {(locales[language]||locales.ENG).nav.about}</span>{name&&<h2>{name}<span className="accent">.</span></h2>}{bio&&<p>{bio}</p>}<blockquote className="about-quote"><span className="about-quote-mark" aria-hidden="true">“</span><p>{quote.body} {quote.ending}</p></blockquote><a className="text-button" href="#contact">{textFor(language).together}<ArrowUpRight size={18}/></a></Reveal>
    </div>}
  </div></section>;
}
export function EducationSection({ language }) {
  const state=useContent('/api/education/',language), [expanded,setExpanded]=useState(null);
  const items=Array.isArray(state.data)?state.data:[];
  return <section className="section section-compact" id="education"><div className="container"><SectionTitle index="02" label={(locales[language]||locales.ENG).nav.education} title={(locales[language]||locales.ENG).nav.education}/><ContentState state={state} language={language} empty={!items.length}/><div className="education-stack">{items.map(item=><Reveal className="education-row glass" key={item.id}><button className="education-toggle" aria-expanded={expanded===item.id} onClick={()=>setExpanded(expanded===item.id?null:item.id)}><span className="education-symbol">{item.logo?<img src={item.logo} alt="" loading="lazy"/>:<GraduationCap/>}</span><span><strong>{localized(item,'name',language)}</strong><small>{localizedPeriod(item.period,language)}</small></span>{expanded===item.id?<Minus size={19}/>:<Plus size={19}/>}</button>{expanded===item.id&&<><p className="education-description">{localized(item,'description',language)}</p><EducationLinks links={item.links} language={language}/></>}</Reveal>)}</div></div></section>;
}
export function CertificatesSection({ language }) {
  const state=useContent('/api/certificates/',language),[selected,setSelected]=useState(null);
  const items=Array.isArray(state.data)?state.data:[];
  return <section className="section section-compact" id="certificates"><div className="container"><SectionTitle index="02.1" label={(locales[language]||locales.ENG).nav.education} title={(locales[language]||locales.ENG).certificates.title}/><ContentState state={state} language={language} empty={!items.length}/><div className="credential-grid">{items.map(c=><Reveal as="button" className="credential-card glass" key={c.id} disabled={!c.image&&!c.file} onClick={()=>setSelected(c)}>{c.image?<img src={c.image} alt="" loading="lazy"/>:<div className="credential-placeholder"><Award size={40}/></div>}<div><span className="eyebrow">{c.organization||textFor(language).credentials} {c.year&&' / '+c.year}</span><h3>{localized(c,'title',language)}</h3><span className="text-button">{!c.image&&!c.file?({UZ:'Hujjat keyinroq qo‘shiladi',ENG:'Document coming soon',RU:'Документ будет добавлен',JP:'証明書は後日追加'}[language]||'Document coming soon'):textFor(language).viewCertificate}<ArrowUpRight size={17}/></span></div></Reveal>)}</div></div>{selected&&<MediaViewer fitContent title={localized(selected,'title',language)} category={textFor(language).credentials} language={language} images={selected.image?[{image:selected.image}]:selected.file&&!/\.pdf(?:\?|$)/i.test(selected.file)?[{image:selected.file}]:[]} pdfUrl={!selected.image&&/\.pdf(?:\?|$)/i.test(selected.file||'')?selected.file:null} onClose={()=>setSelected(null)}/>}</section>;
}
export function SkillsSection({ language }) {
  const state=useContent('/api/skills/',language), traitsState=useContent('/api/traits/',language);
  const items=Array.isArray(state.data)?state.data:[],traits=Array.isArray(traitsState.data)?traitsState.data:[];
  const t=(locales[language]||locales.ENG).skills;
  const skillGroup = type => items.some(s=>s.type===type)&&<div className="skills-group">{type==='Personal'&&<SubsectionTitle index="03.1" label={t.personal}/>}<div className={type==='Software'?'tool-grid':'personal-grid'}>{items.filter(s=>s.type===type).map((s,i)=><Reveal className="tool-card glass" key={s.id} scale={type==='Software'?.9:1} y={type==='Software'?0:20} duration={.4} delay={i*(type==='Software'?.05:.06)}><span className={'tool-symbol tool-color-'+i%6}>{s.image?<img src={s.image} alt="" loading="lazy"/>:type==='Personal'?['✦','◎','◈','✱'][i%4]:s.name.toLowerCase().includes('photoshop')?'Ps':s.name.toLowerCase().includes('illustrator')?'Ai':s.name.toLowerCase().includes('framer')?'Fr':s.name.slice(0,1)}</span><span>{localized(s,'name',language)}</span></Reveal>)}</div></div>;
  return <section className="section" id="skills"><div className="container">
    <SectionTitle index="03" label={t.title} title={t.software}/>
    <ContentState state={state} language={language} empty={!items.length}/>
    {skillGroup('Software')}
    <Services language={language}/>
    {skillGroup('Personal')}
    <ContentState state={traitsState} language={language}/>
    {traits.length>0&&<div className="personal-traits">{!items.some(s=>s.type==='Personal')&&<SubsectionTitle index="03.1" label={t.personal}/>}<div className="traits-grid">{['Strength','Weakness'].map(type=><div key={type}><h3 className="subheading">{type==='Strength'?t.strengthsTitle:t.weaknessesTitle}</h3>{traits.filter(s=>s.type===type).map((s,i)=><Reveal className="trait-row glass" key={s.id} x={type==='Strength'?-20:20} y={0} duration={.4} delay={i*.06}><span className="accent"><TraitIcon trait={s}/></span><span className="trait-text">{localized(s,'text',language)}</span></Reveal>)}</div>)}</div></div>}
  </div></section>;
}
export function ExperienceSection({ language }) {
  const state=useContent('/api/experiences/',language),items=Array.isArray(state.data)?state.data:[];
  const t=(locales[language]||locales.ENG).experience;
  return <section className="section" id="experience"><div className="container"><SectionTitle index="04" label={textFor(language).journey} title={t.title}/><ContentState state={state} language={language} empty={!items.length}/><div className="journey">{items.map((job,i)=><Reveal as="article" className="journey-row" key={job.id} delay={i*.1}><span className="journey-marker" aria-hidden="true"><Briefcase size={16}/></span><div className="journey-card glass"><div className="journey-top"><div><div className="journey-date">{localizedPeriod(job.period,language)}</div><h3>{localized(job,'role',language)}</h3><span className="journey-company">{localized(job,'company',language)}</span></div><ExperienceProcess job={job}/></div><p>{localized(job,'desc',language)}</p></div></Reveal>)}</div></div></section>;
}
