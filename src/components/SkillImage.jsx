import {refreshFailedMedia} from '../lib/content';
import {useState} from 'react';
export default function SkillImage({src,name}) {
 const [failed,setFailed]=useState('');
 const proxy='/api/image-source?url='+encodeURIComponent(src);
 const canProxy=!import.meta.env.DEV&&src.startsWith('https://br-cold-sun-b1ney4xj.storage.c-5.eu-central-1.aws.neon.tech/portfolio-media/uploads/');
 const fallback=name.toLowerCase().includes('photoshop')?'Ps':name.toLowerCase().includes('figma')?'F':name.slice(0,2);
 if(failed===proxy||(!canProxy&&failed===src))return <span className="skill-image-fallback" aria-label={name}>{fallback}</span>;
 const image=failed===src?proxy:src;
 return <img src={image} alt="" loading="lazy" decoding="async" onError={()=>{setFailed(image);if(image===proxy||!canProxy)refreshFailedMedia('/api/skills/');}}/>;
}
