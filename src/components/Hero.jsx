import { ArrowRight } from 'lucide-react';
import { locales } from '../locales';
import './Hero.css';

const Hero = ({ language }) => {
  const t = locales[language];

  // Helper to render headings dynamically with correct language-specific highlighting
  const renderTitle = () => {
    switch (language) {
      case 'UZ':
        return (
          <h1 className="hero-title">
            <span className="hero-title-line">{t.hero.titlePart1}</span>
            <span className="hero-title-line">
              raqamli <span className="highlight-lime">tajribalar</span>
            </span>
            <span className="hero-title-line">
              <span className="highlight-cyan">{t.hero.titlePart3}</span>
            </span>
          </h1>
        );
      case 'ENG':
        return (
          <h1 className="hero-title">
            <span className="hero-title-line">{t.hero.titlePart1}</span>
            <span className="hero-title-line">
              <span className="highlight-lime">digital</span> experiences
            </span>
            <span className="hero-title-line">
              <span className="highlight-cyan">{t.hero.titlePart3}</span>
            </span>
          </h1>
        );
      case 'RU':
        return (
          <h1 className="hero-title">
            <span className="hero-title-line">{t.hero.titlePart1}</span>
            <span className="hero-title-line">
              <span className="highlight-lime">цифровые</span> впечатления
            </span>
            <span className="hero-title-line">
              <span className="highlight-cyan">{t.hero.titlePart3}</span>
            </span>
          </h1>
        );
      case 'JP':
        return (
          <h1 className="hero-title">
            <span className="hero-title-line">{t.hero.titlePart1}</span>
            <span className="hero-title-line">
              <span className="highlight-lime">デジタル</span>体験を
            </span>
            <span className="hero-title-line">
              <span className="highlight-cyan">{t.hero.titlePart3}</span>
            </span>
          </h1>
        );
      default:
        return null;
    }
  };

  return (
    <section id="home" className="hero-section">
      <div className="container">
        <div className="hero-content">
          {/* Subtitle */}
          <div className="hero-subtitle">{t.hero.subtitle}</div>

          {/* Heading */}
          {renderTitle()}

          {/* Description */}
          <p className="hero-description">{t.hero.description}</p>

          {/* Buttons */}
          <div className="hero-buttons">
            <a href="#portfolio" className="btn-primary">
              {t.hero.ctaPrimary}
              <ArrowRight />
            </a>
            <a href="#contact" className="btn-secondary">
              {t.hero.ctaSecondary}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
