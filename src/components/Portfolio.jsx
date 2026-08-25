import { useState, useEffect } from 'react';
import { ArrowRight, Eye } from 'lucide-react';
import { locales } from '../locales';
import './Portfolio.css';

export default function Portfolio({ language, onViewAll }) {
  const t = locales[language]?.portfolio || locales['UZ'].portfolio;
  const [projectsList, setProjectsList] = useState([]);

  useEffect(() => {
    fetch(`${window.API_BASE_URL}/api/portfolio/projects/?lang=${language.toLowerCase()}`)
      .then(res => res.json())
      .then(data => setProjectsList(data))
      .catch(err => console.error('Error loading portfolio projects:', err));
  }, [language]);

  // Helper to map DB project to work item expected by CSS/renderer
  const mapProjectToWork = (proj) => {
    // Map categories to iconText
    let iconText = 'web_design';
    if (proj.category === 'UX_UI') iconText = 'ux_ui';
    else if (proj.category === 'PRESENTATION') iconText = 'presentation';
    else if (proj.category === 'PRINT_DESIGN') iconText = 'print_design';

    // Map categories to imageClass gradients
    let imageClass = 'bg-gradient-startup';
    if (proj.category === 'UX_UI') {
      imageClass = proj.title.toLowerCase().includes('fintech') ? 'bg-gradient-fintech' : 'bg-gradient-dashboard';
    } else if (proj.category === 'PRESENTATION') {
      imageClass = proj.title.toLowerCase().includes('noq') ? 'bg-gradient-noq' : 'bg-gradient-pitch';
    } else if (proj.category === 'PRINT_DESIGN') {
      imageClass = 'bg-gradient-brochure';
    }

    // Parse hashtags
    const tags = [
      proj.main_hashtag || '',
      ...(proj.regular_hashtags 
        ? proj.regular_hashtags.split(',').map(tag => tag.trim()).filter(Boolean)
        : [])
    ].filter(Boolean);

    return {
      id: proj.id,
      slug: proj.slug || proj.id,
      key: proj.title.toLowerCase().replace(/[^a-z0-9]/g, ''), // Fallback string key for demo loaders
      imageClass,
      iconText,
      coverImage: proj.cover_image,
      data: {
        category: proj.category,
        title: proj.title,
        desc: proj.description,
        tags: tags
      }
    };
  };

  // Group real projects
  const mappedProjects = projectsList.map(mapProjectToWork);

  // Show up to 6 projects in the main grid
  const recentWorks = mappedProjects.slice(0, 6);

  const renderProjectRow = (worksList) => {
    return (
      <div className="portfolio-grid">
        {worksList.map((work, index) => (
          <div 
            key={`${work.id}-${index}`} 
            className="portfolio-card"
            onClick={() => {
              window.history.pushState(null, '', `/portfolio/${work.slug}`);
              window.dispatchEvent(new Event('popstate'));
            }}
          >
            {/* Image Container with premium HSL/custom gradient and hover overlays */}
            <div className={`portfolio-img-container ${work.imageClass}`}>
              {/* Subtle ambient light dot */}
              <div className="card-light-dot"></div>
              
              {/* Render real uploaded cover image if exists */}
              {work.coverImage ? (
                <img src={work.coverImage} alt={work.data.title} className="portfolio-cover-img" />
              ) : (
                /* Retro arcade graphic for testers, premium vectors for others */
                work.key === 'brochure' || work.key === 'brochuredup' ? (
                  <div className="testers-arcade-graphic">
                    <div className="arcade-glow-screen">
                      <svg viewBox="0 0 100 100" className="testers-smiley-svg">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#CCFF33" strokeWidth="2" strokeDasharray="3 3"/>
                        <rect x="35" y="35" width="6" height="6" fill="#CCFF33" />
                        <rect x="59" y="35" width="6" height="6" fill="#CCFF33" />
                        <path d="M 35 60 Q 50 75 65 60" fill="none" stroke="#CCFF33" strokeWidth="4" strokeLinecap="round" />
                      </svg>
                      <span className="testers-label">TESTERS</span>
                    </div>
                  </div>
                ) : work.iconText === 'presentation' ? (
                  <div className="presentation-vector-graphic">
                    <div className="vector-chart-line"></div>
                    <div className="vector-bar vector-bar-1"></div>
                    <div className="vector-bar vector-bar-2"></div>
                    <div className="vector-bar vector-bar-3"></div>
                  </div>
                ) : (
                  <div className="abstract-ui-graphic">
                    <div className="abstract-card-ui card-ui-1"></div>
                    <div className="abstract-card-ui card-ui-2"></div>
                  </div>
                )
              )}

              {/* View Overlay with Eye Icon */}
              <div className="portfolio-overlay">
                <div className="portfolio-view-icon">
                  <Eye size={20} />
                </div>
              </div>
            </div>

            {/* Project Meta Info */}
            <div className="portfolio-info">
              {/* Category tag */}
              <span className="portfolio-category">{work.data.category}</span>
              
              {/* Title */}
              <h3 className="portfolio-card-title">{work.data.title}</h3>
              
              {/* Description */}
              <p className="portfolio-card-desc">{work.data.desc}</p>
              
              {/* Tags pill layout */}
              <div className="portfolio-tags">
                {work.data.tags.map((tag, tagIndex) => {
                  if (tagIndex === 0) {
                    return (
                      <button
                        key={tag}
                        className="portfolio-tag-pill tag-active tag-btn"
                        onClick={(e) => {
                          e.stopPropagation(); // Avoid triggering details modal
                          onViewAll(tag);
                        }}
                      >
                        {tag}
                      </button>
                    );
                  }
                  return (
                    <span
                      key={tag}
                      className="portfolio-tag-pill tag-inactive"
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>

            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="portfolio-section" id="portfolio">
      <div className="container">
        {/* Section Header */}
        <div className="portfolio-header">
          <div className="portfolio-header-left">
            <span className="portfolio-label">{t.label}</span>
            <h2 className="portfolio-title">{t.title}</h2>
          </div>
          
          {/* Glassmorphic View All Button */}
          <button className="portfolio-btn-viewall" onClick={() => onViewAll()}>
            <span>{t.viewAll}</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Portfolio Projects Grid */}
        <div className="portfolio-row-group">
          {renderProjectRow(recentWorks)}
        </div>
      </div>
    </section>
  );
}
