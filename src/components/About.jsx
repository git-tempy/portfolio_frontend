import React from 'react';
import './About.css';
import { locales } from '../locales';

const About = ({ language, dbAbout }) => {
  const t = locales[language]?.about || locales['UZ'].about;

  const getTranslatedBio = () => {
    if (!dbAbout) return t.description;
    const lang = language.toUpperCase();
    if (lang === 'UZ') return dbAbout.bio_uz || dbAbout.bio;
    if (lang === 'RU') return dbAbout.bio_ru || dbAbout.bio;
    if (lang === 'ENG') return dbAbout.bio_en || dbAbout.bio;
    if (lang === 'JP') return dbAbout.bio_jp || dbAbout.bio;
    return dbAbout.bio;
  };

  const getTranslatedName = () => {
    if (!dbAbout) return "Feruzxon Muxtarov";
    const lang = language.toUpperCase();
    if (lang === 'UZ') return dbAbout.name_uz || dbAbout.name;
    if (lang === 'RU') return dbAbout.name_ru || dbAbout.name;
    if (lang === 'ENG') return dbAbout.name_en || dbAbout.name;
    if (lang === 'JP') return dbAbout.name_jp || dbAbout.name;
    return dbAbout.name;
  };

  const displayName = getTranslatedName();
  const displayBio = getTranslatedBio();

  return (
    <section className="about-section" id="about">
      <div className="container about-inner">
        {/* Left — glassmorphic card with avatar and animated border */}
        <div className="about-card-wrap">
          <div className="about-card-border-anim">
            <div className="about-card">
              <div className="about-card-glow" />
              <img
                src={dbAbout?.image || "/about-avatar.png"}
                alt={displayName}
                className="about-avatar"
              />
            </div>
          </div>
        </div>

        {/* Right — text content */}
        <div className="about-content">
          <h2 className="about-title">{displayName}</h2>
          <p className="about-description">{displayBio}</p>
        </div>
      </div>
    </section>
  );
};

export default About;
