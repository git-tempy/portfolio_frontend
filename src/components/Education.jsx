import { useState, useEffect } from 'react';
import { GraduationCap, ChevronDown } from 'lucide-react';
import './Education.css';

export default function Education({ language }) {
  const [educations, setEducations] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetch(window.API_BASE_URL + '/api/education/')
      .then(res => res.json())
      .then(data => setEducations(data))
      .catch(err => console.error('Error fetching education:', err));
  }, []);

  const displayLang = language.toLowerCase() === 'eng' ? 'en' : language.toLowerCase();

  const getSectionTitle = () => {
    switch (language) {
      case 'UZ': return "Ta'lim";
      case 'RU': return "Образование";
      case 'ENG': return "Education";
      case 'JP': return "学歴・教育";
      default: return "Ta'lim";
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (educations.length === 0) return null;

  return (
    <section className="education-section" id="education">
      <div className="container">
        {/* Section Header */}
        <div className="education-header">
          <h2 className="education-title">{getSectionTitle()}</h2>
        </div>

        {/* Accordion List */}
        <div className="education-list">
          {educations.map((item, index) => {
            const displayName = item[`name_${displayLang}`] || item.name;
            const displayDesc = item[`description_${displayLang}`] || item.description;
            const isExpanded = expandedId === item.id;

            return (
              <div 
                key={item.id || index} 
                className={`education-accordion-card glass-panel ${isExpanded ? 'expanded' : ''}`}
                onClick={() => toggleExpand(item.id)}
              >
                <div className="education-accordion-header">
                  {/* Left Column: Logo & Text */}
                  <div className="education-left-block">
                    <div className="education-logo-circle">
                      {item.logo ? (
                        <img src={item.logo} alt={displayName} className="education-circle-img" />
                      ) : (
                        <GraduationCap size={20} className="education-circle-fallback" />
                      )}
                    </div>
                    <div className="education-text-block">
                      <h3 className="education-name-bold">{displayName}</h3>
                      <span className="education-period-sub">{item.period}</span>
                    </div>
                  </div>

                  {/* Right Column: Chevron Down Arrow */}
                  <div className="education-arrow-block">
                    <ChevronDown size={24} className={`education-chevron-icon ${isExpanded ? 'rotated' : ''}`} />
                  </div>
                </div>

                {/* Dropdown Content */}
                <div className={`education-accordion-body ${isExpanded ? 'show' : ''}`}>
                  <div className="education-body-inner">
                    <p className="education-description-text">{displayDesc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
