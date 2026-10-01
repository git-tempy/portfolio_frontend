import { ArrowRight } from 'lucide-react';
import { locales } from '../locales';
import Reveal from './Reveal';
const heroCopy = {
 UZ:{eyebrow:'GRAFIK & DIGITAL DIZAYNER',title:['His-tuyg‘u va empatiya,','chegarasiz tafakkur —','dizaynerni AI’dan ajratib turadigan kuch.'],description:'Odamni tushunishdan boshlangan dizayn: brendda o‘ziga xoslik, interfeysda qulaylik, har bir detalda esa ma’no va maqsad bor.'},
 ENG:{eyebrow:'GRAPHIC & DIGITAL DESIGNER',title:['Emotion and empathy,','thinking without limits —','the strength that sets designers apart from AI.'],description:'Design starts with understanding people: a distinct brand, an intuitive interface, and meaning and purpose in every detail.'},
 RU:{eyebrow:'ГРАФИЧЕСКИЙ & DIGITAL-ДИЗАЙНЕР',title:['Чувства и эмпатия,','мышление без границ —','сила, отличающая дизайнера от ИИ.'],description:'Дизайн начинается с понимания людей: характер бренда, удобство интерфейса а в каждой детали — смысл и цель.'},
 JP:{eyebrow:'グラフィック＆デジタルデザイナー',title:['感性と共感、','枠にとらわれない思考。','デザイナーをAIと分かつ力。'],description:'人を理解することから始まるデザイン。ブランドには個性を、インターフェースには使いやすさを、一つひとつの細部に意味と意図を込めます。'}
};
export default function Hero({language}) {
 const t=locales[language]||locales.ENG,text=heroCopy[language]||heroCopy.ENG;
 return <section id="home" className="hero-section hero-human" data-language={language}><div className="container">
 <Reveal immediate duration={.6} as="p" className="hero-eyebrow">{text.eyebrow}</Reveal>
 <Reveal immediate duration={.8} delay={.1} y={30} as="h1" className="hero-title">{text.title.map((line,i)=><span key={line} className={'hero-copy-line'+(i===2?' hero-gradient':'')}>{line}{i<2?' ':''}</span>)}</Reveal>
 <Reveal immediate duration={.7} delay={.3} as="p" className="hero-description">{text.description}</Reveal>
 <Reveal immediate duration={.7} delay={.45} className="hero-actions"><a className="button button-primary" href="#portfolio">{t.hero.ctaPrimary}<ArrowRight size={16}/></a><a className="button button-glass" href="#contact">{t.hero.ctaSecondary}</a></Reveal>
 </div></section>;
}
