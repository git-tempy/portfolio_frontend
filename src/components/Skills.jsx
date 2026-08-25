import { useState, useEffect } from 'react';
import './Skills.css';
import { locales } from '../locales';

const getAbbreviation = (name) => {
  if (!name) return '';
  if (name.length <= 2) return name;
  if (name.toLowerCase() === 'figma') return 'F';
  if (name.toLowerCase() === 'photoshop') return 'Ps';
  if (name.toLowerCase() === 'illustrator') return 'Ai';
  if (name.toLowerCase() === 'after effects') return 'Ae';
  return name.slice(0, 2);
};

const getSkillClass = (name) => {
  const n = name.toLowerCase();
  if (n.includes('figma')) return 'figma';
  if (n.includes('photoshop')) return 'photoshop';
  if (n.includes('illustrator')) return 'illustrator';
  if (n.includes('corel')) return 'coreldraw';
  if (n.includes('tilda')) return 'tilda';
  if (n.includes('framer')) return 'framer';
  if (n.includes('after')) return 'after-effects';
  return 'default-skill';
};

const getPersonalSkillIcon = (name) => {
  const n = name.toLowerCase();
  if (n.includes('strategy') || n.includes('strategik')) {
    return {
      iconClass: 'strategic',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="pill-svg">
          <path d="M12 3L21 12L12 21L3 12Z"/>
          <circle cx="12" cy="12" r="2.5" fill="currentColor"/>
        </svg>
      )
    };
  }
  if (n.includes('team') || n.includes('jamoa')) {
    return {
      iconClass: 'teamwork',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="pill-svg">
          <circle cx="12" cy="12" r="8"/>
          <circle cx="12" cy="12" r="4"/>
          <circle cx="12" cy="12" r="1" fill="currentColor"/>
        </svg>
      )
    };
  }
  if (n.includes('creative') || n.includes('creative thinking') || n.includes('ijod')) {
    return {
      iconClass: 'creativity',
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="pill-svg">
          <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z"/>
        </svg>
      )
    };
  }
  return {
    iconClass: 'detail',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="pill-svg">
        <line x1="12" y1="4" x2="12" y2="20"/>
        <line x1="4" y1="12" x2="20" y2="12"/>
        <line x1="6.34" y1="6.34" x2="17.66" y2="17.66"/>
        <line x1="6.34" y1="17.66" x2="17.66" y2="6.34"/>
      </svg>
    )
  };
};

const traitIcons = {
  lightning: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z"/>
    </svg>
  ),
  target: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
    </svg>
  ),
  sparkle: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z"/>
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  )
};

export default function Skills({ language }) {
  const t = locales[language]?.skills || locales['UZ'].skills;
  const [skillsList, setSkillsList] = useState([]);
  const [traitsList, setTraitsList] = useState([]);

  useEffect(() => {
    fetch(window.API_BASE_URL + '/api/skills/')
      .then(res => res.json())
      .then(data => setSkillsList(data))
      .catch(err => console.error(err));

    fetch(window.API_BASE_URL + '/api/traits/')
      .then(res => res.json())
      .then(data => setTraitsList(data))
      .catch(err => console.error(err));
  }, []);

  const displayLang = language.toLowerCase() === 'eng' ? 'en' : language.toLowerCase();

  const softwareSkills = skillsList.filter(s => s.type === 'Software');
  const personalSkills = skillsList.filter(s => s.type === 'Personal');
  const strengths = traitsList.filter(t => t.type === 'Strength');
  const weaknesses = traitsList.filter(t => t.type === 'Weakness');

  return (
    <section className="skills-section" id="skills">
      <div className="container">
        {/* Section Header */}
        <div className="skills-header">
          <h2 className="skills-title">{t.title}</h2>
        </div>

        {/* Software skills subheading & grid */}
        {softwareSkills.length > 0 && (
          <>
            <h3 className="skills-sub-heading">{t.software}</h3>
            <div className="skills-software-grid">
              {softwareSkills.map((skill) => {
                const name = skill[`name_${displayLang}`] || skill.name;
                return (
                  <div key={skill.id} className="skill-card">
                    <div className={`skill-icon ${getSkillClass(skill.name)}`}>
                      {skill.image ? (
                        <img src={skill.image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      ) : (
                        getAbbreviation(skill.name)
                      )}
                    </div>
                    <span className="skill-name">{name}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Personal skills subheading & grid */}
        {personalSkills.length > 0 && (
          <>
            <h3 className="skills-sub-heading personal-heading">{t.personal}</h3>
            <div className="skills-personal-grid">
              {personalSkills.map((pill) => {
                const name = pill[`name_${displayLang}`] || pill.name;
                const iconData = getPersonalSkillIcon(name);
                return (
                  <div key={pill.id} className="skill-pill">
                    <div className={`skill-pill-icon ${iconData.iconClass}`}>
                      {iconData.svg}
                    </div>
                    <span className="skill-pill-name">{name}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Traits (Kuchli / Zaif) Grid */}
        {(strengths.length > 0 || weaknesses.length > 0) && (
          <div className="skills-traits-grid">
            {/* Kuchli (Strengths) */}
            {strengths.length > 0 && (
              <div className="traits-column">
                <h4 className="traits-title kuchli">{t.strengthsTitle}</h4>
                <div className="traits-list">
                  {strengths.map((st, idx) => {
                    const text = st[`text_${displayLang}`] || st.text;
                    const iconTypes = ['lightning', 'target', 'sparkle'];
                    const iconType = iconTypes[idx % iconTypes.length];
                    return (
                      <div key={st.id} className="trait-pill">
                        <div className={`trait-icon ${iconType}`}>
                          {traitIcons[iconType]}
                        </div>
                        <span className="trait-text">{text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Zaif (Weaknesses) */}
            {weaknesses.length > 0 && (
              <div className="traits-column">
                <h4 className="traits-title zaif">{t.weaknessesTitle}</h4>
                <div className="traits-list">
                  {weaknesses.map((wk, idx) => {
                    const text = wk[`text_${displayLang}`] || wk.text;
                    const iconTypes = ['clock', 'globe'];
                    const iconType = iconTypes[idx % iconTypes.length];
                    return (
                      <div key={wk.id} className="trait-pill">
                        <div className={`trait-icon ${iconType}`}>
                          {traitIcons[iconType]}
                        </div>
                        <span className="trait-text">{text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
