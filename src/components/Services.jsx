import {useContent,localized} from '../lib/content';
import './Services.css';
export default function Services({language}){
 const state=useContent('/api/skills/',language),items=(Array.isArray(state.data)?state.data:[]).filter(s=>s.type==='Service');
 if(!items.length)return null;
 return <div className="services-group"><h3 className="subheading">{({UZ:'Xizmatlar',ENG:'Services',RU:'Услуги',JP:'サービス'})[language]}</h3><div className="services-marquee"><div className="services-track">{[0,1].map(copy=><div className="services-copy" key={copy} aria-hidden={copy===1||undefined}>{items.map(s=><span className="service-pill" key={s.id}><span aria-hidden="true"/> {localized(s,'name',language)}</span>)}</div>)}</div></div></div>;
}

