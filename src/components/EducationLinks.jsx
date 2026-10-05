import {ArrowUpRight} from 'lucide-react';
import {langCode, navigate} from '../lib/content';
import {normalizeTag} from '../lib/projectTags';
export default function EducationLinks({links,language}) {
 const valid=(Array.isArray(links)?links:[]).filter(link=>link.value&&link.labels&&['tag','url'].includes(link.kind));
 if(!valid.length)return null;
 return <div className="education-links">{valid.map((link,index)=>{
  const label=link.labels[langCode(language)]||link.labels.uz||Object.values(link.labels).find(Boolean);
  const href=link.kind==='tag'?'/portfolio?lang='+language+'&tag='+encodeURIComponent(normalizeTag(link.value)):link.value;
  const internal=href.startsWith('/')&&!href.startsWith('//');
  if(!internal&&!/^https?:\/\//i.test(href))return null;
  return <a key={index} href={href} target={internal?undefined:'_blank'} rel={internal?undefined:'noopener noreferrer'} onClick={internal?e=>{if(!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&!e.altKey){e.preventDefault();navigate(href);}}:undefined}>{label}<ArrowUpRight size={16}/></a>;
 })}</div>;
}
