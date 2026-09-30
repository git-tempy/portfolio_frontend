import { ArrowRight } from 'lucide-react';
import { locales } from '../locales';
import Reveal from './Reveal';
export default function Hero({ language }) {
  const t = locales[language] || locales.ENG;
  const title = {
    ENG: <>I craft digital experiences <span className="hero-gradient">that leave a mark</span></>,
    UZ: <>Iz qoldiradigan <span className="hero-gradient">raqamli tajribalar yarataman</span></>,
    RU: <>Я создаю цифровые <span className="hero-gradient">впечатления, оставляющие след</span></>,
    JP: <>心に残る <span className="hero-gradient">デジタル体験をつくります</span></>
  };
  return <section id="home" className="hero-section"><div className="container">
    <Reveal immediate duration={.6} as="p" className="hero-eyebrow">{t.hero.subtitle}</Reveal>
    <Reveal immediate duration={.8} delay={.1} y={30} as="h1" className="hero-title">{title[language] || title.ENG}</Reveal>
    <Reveal immediate duration={.7} delay={.3} as="p" className="hero-description">{t.hero.description}</Reveal>
    <Reveal immediate duration={.7} delay={.45} className="hero-actions"><a className="button button-primary" href="#portfolio">{t.hero.ctaPrimary}<ArrowRight size={16}/></a><a className="button button-glass" href="#contact">{t.hero.ctaSecondary}</a></Reveal>
  </div></section>;
}
