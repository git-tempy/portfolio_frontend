import { useEffect, useState } from 'react';
import { useContent } from '../lib/content';
import './SkillCube.css';

const brands = [
  { match: /figma/i, key: 'figma', label: 'Figma', color: '#a259ff' },
  { match: /photoshop/i, key: 'ps', label: 'Ps', color: '#31a8ff' },
  { match: /illustrator/i, key: 'ai', label: 'Ai', color: '#ff9a00' },
  { match: /corel/i, key: 'corel', label: 'Corel', color: '#78e83b' },
  { match: /framer/i, key: 'framer', label: 'Framer', color: '#53caff' },
  { match: /tilda/i, key: 'tilda', label: 'Tilda', color: '#ff9e83' },
];
function Mark({ tool }) {
  if (tool.key === 'figma') return <svg viewBox="0 0 38 56" fill="none"><path d="M10 0h9v19h-9a9.5 9.5 0 0 1 0-19" fill="#f24e1e"/><path d="M19 0h9a9.5 9.5 0 0 1 0 19h-9" fill="#ff7262"/><path d="M10 19h9v18h-9a9 9 0 0 1 0-18" fill="#a259ff"/><circle cx="28" cy="28" r="9" fill="#1abcfe"/><path d="M10 37h9v9a9 9 0 1 1-9-9" fill="#0acf83"/></svg>;
  if (tool.key === 'framer') return <svg viewBox="0 0 40 60" fill="currentColor"><path d="M0 0h40v20H20L0 0Zm0 20h20l20 20H0V20Zm0 20h20v20L0 40Z"/></svg>;
  return <span className={'skill-cube-monogram skill-cube-monogram--'+tool.key}>{tool.label}</span>;
}
const faces = ['front','back','right','left','top','bottom'];
function CubeScene() {
  const { data } = useContent('/api/skills/');
  const tools = (Array.isArray(data) ? data : []).filter(s=>s.type==='Software').map(skill=>{
    const brand=brands.find(item=>item.match.test(skill.name));
    // Hero marks stay crisp and independent of uploaded skill-card artwork.
    return {key:brand?.key||String(skill.id),label:brand?.label||skill.name.slice(0,2),color:brand?.color||'#ccff33'};
  });
  if (!tools.length) return null;
  return <div className="skill-cube-scene" aria-hidden="true">
    <div className="skill-cube-halo"/><div className="skill-cube-shadow"/>
    <div className="skill-cube-perspective"><div className="skill-cube-orbit"><div className="skill-cube-tilt">
      {[-1,0,1].map((y,layer)=><div className={'skill-cube-layer skill-cube-layer--'+layer} key={y} style={{'--layer-y':y}}>
        {[-1,0,1].flatMap((x)=>[-1,0,1].map(z=><div className="skill-cubie" key={`${x}:${z}`} style={{'--x':x,'--z':z}}>
          {faces.map((face,i)=>{
            const outside=(face==='front'&&z===1)||(face==='back'&&z===-1)||(face==='right'&&x===1)||(face==='left'&&x===-1)||(face==='top'&&y===-1)||(face==='bottom'&&y===1);
            const tool=tools[((x+1)*3+(z+1)+layer*2+i)%tools.length];
            return <div className={'skill-cubie-face skill-cubie-face--'+face+(outside?'':' skill-cubie-face--inner')} key={face}>
              {outside&&<div className="skill-cube-sticker" style={{'--tile-color':tool.color}}><span className="skill-cube-logo-core"><Mark tool={tool}/></span></div>}
            </div>;
          })}
        </div>))}
      </div>)}
    </div></div></div>
  </div>;
}
export default function SkillCube() {
  const [desktop,setDesktop]=useState(()=>window.matchMedia('(min-width: 1200px)').matches);
  useEffect(()=>{const query=window.matchMedia('(min-width: 1200px)');const update=()=>setDesktop(query.matches);query.addEventListener('change',update);return()=>query.removeEventListener('change',update);},[]);
  return desktop ? <CubeScene/> : null;
}
