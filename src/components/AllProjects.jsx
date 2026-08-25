import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import './AllProjects.css';

export default function AllProjects({ language, initialSearch = '', onBack }) {

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsList, setProjectsList] = useState([]);

  const itemsPerPage = 12;

  const [dbCategories, setDbCategories] = useState([]);

  // Scroll to top and fetch projects on page mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    fetch(`${window.API_BASE_URL}/api/portfolio/projects/?lang=${language.toLowerCase()}`)
      .then(res => res.json())
      .then(data => setProjectsList(data))
      .catch(err => console.error('Error loading portfolio projects:', err));

    fetch(`${window.API_BASE_URL}/api/portfolio/categories/?lang=${language.toLowerCase()}`)
      .then(res => res.json())
      .then(data => setDbCategories(data))
      .catch(err => console.error('Error loading portfolio categories:', err));
  }, [language]);

  // Map DB project to format expected by search & renderers
  const allProjectsList = projectsList.map(proj => {
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
      key: proj.title.toLowerCase().replace(/[^a-z0-9]/g, ''), // Fallback string key
      imageClass,
      type: proj.type,
      coverImage: proj.cover_image,
      data: {
        category: proj.category,
        title: proj.title,
        desc: proj.description,
        tags: tags
      }
    };
  });

  const formatCategoryLabel = (name) => {
    if (name === 'UX_UI') return 'UX/UI';
    if (name === 'WEB_DESIGN') return 'Web Design';
    if (name === 'PRESENTATION') return 'Presentation';
    if (name === 'PRINT_DESIGN') return 'Print Design';
    return name.replace(/_/g, ' ')
               .replace(/\b\w/g, c => c.toUpperCase());
  };

  // Filtering Categories dynamically
  const categories = [
    { key: 'ALL', label: language === 'UZ' ? 'Barchasi' : language === 'ENG' ? 'All' : language === 'RU' ? 'Все' : 'すべて' },
    ...dbCategories.map(cat => ({
      key: cat.name,
      label: formatCategoryLabel(cat.name)
    }))
  ];

  // Filter & Search Logic
  const filteredProjects = allProjectsList.filter(project => {
    const matchesCategory = selectedCategory === 'ALL' || project.data.category === selectedCategory;
    const matchesSearch = 
      project.data.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.data.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.data.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  // Pagination calculations
  const totalItems = filteredProjects.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  // Handle page resets when category or search changes
  const handleCategoryChange = (catKey) => {
    setSelectedCategory(catKey);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="all-portfolio-section">
      <div className="container">
        {/* Header toolbar */}
        <div className="all-portfolio-header">
          <button className="back-btn" onClick={onBack}>
            <ArrowLeft size={16} />
            <span>{language === 'UZ' ? 'Orqaga' : language === 'ENG' ? 'Back' : language === 'RU' ? 'Назад' : '戻る'}</span>
          </button>
          
          <h2 className="all-portfolio-title">
            {language === 'UZ' ? 'Barcha Loyihalar' : language === 'ENG' ? 'All Projects' : language === 'RU' ? 'Все проекты' : 'すべてのプロジェクト'}
          </h2>
        </div>

        {/* Search and Filters panel */}
        <div className="portfolio-search-filter-panel">
          {/* Search box */}
          <div className="search-box-wrapper">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder={language === 'UZ' ? 'Loyihalarni qidirish...' : language === 'ENG' ? 'Search projects...' : language === 'RU' ? 'Поиск проектов...' : 'プロジェクトを検索...'}
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          {/* Categories bar */}
          <div className="categories-filter-bar">
            {categories.map(cat => (
              <button
                key={cat.key}
                className={`category-pill ${selectedCategory === cat.key ? 'active-pill' : ''}`}
                onClick={() => handleCategoryChange(cat.key)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Column Grid Layout */}
        {paginatedProjects.length > 0 ? (
          <div className="all-portfolio-grid-three-col">
            {paginatedProjects.map((work, index) => (
              <div 
                key={`${work.id}-${index}`} 
                className="portfolio-card clickable-card"
                onClick={() => {
                  window.history.pushState(null, '', `/portfolio/${work.slug}`);
                  window.dispatchEvent(new Event('popstate'));
                }}
              >
                {/* Image bezel container with gradients */}
                <div className={`portfolio-img-container ${work.imageClass}`}>
                  <div className="card-light-dot"></div>
                  
                  {/* Render real uploaded cover image if exists */}
                  {work.coverImage ? (
                    <img src={work.coverImage} alt={work.data.title} className="portfolio-cover-img" />
                  ) : (
                    /* Decorative graphics */
                    work.key === 'brochure' || work.key === 'branding' ? (
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
                    ) : work.type === 'presentation' ? (
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

                  {/* View Overlay with Eye */}
                  <div className="portfolio-overlay">
                    <div className="portfolio-view-icon">
                      <Eye size={20} />
                    </div>
                  </div>
                </div>

                {/* Meta details */}
                <div className="portfolio-info">
                  <span className="portfolio-category">{work.data.category}</span>
                  <h3 className="portfolio-card-title">{work.data.title}</h3>
                  <p className="portfolio-card-desc">{work.data.desc}</p>
                  
                  <div className="portfolio-tags">
                    {work.data.tags.map((tag, tagIndex) => {
                      if (tagIndex === 0) {
                        return (
                          <button
                            key={tag}
                            className="portfolio-tag-pill tag-active tag-btn"
                            onClick={(e) => {
                              e.stopPropagation(); // Avoid triggering details lightbox modal
                              setSearchTerm(tag);
                              setCurrentPage(1);
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
        ) : (
          <div className="no-projects-found-placeholder">
            <span className="empty-icon">📂</span>
            <h4>
              {language === 'UZ' ? 'Loyihalar topilmadi' : language === 'ENG' ? 'No projects found' : language === 'RU' ? 'Проекты не найдены' : 'プロジェクトが見つかりません'}
            </h4>
            <p>
              {language === 'UZ' ? 'Qidiruv shartlarini o\'zgartirib ko\'ring' : language === 'ENG' ? 'Try adjusting your search filters' : language === 'RU' ? 'Попробуйте изменить поисковые фильтры' : '検索フィルターを調整してください'}
            </p>
          </div>
        )}

        {/* Pagination bar */}
        {totalPages >= 1 && (
          <div className="all-portfolio-pagination">
            <button 
              className="pagination-arrow-btn"
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              title="Previous Page"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="pagination-numbers-list">
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(pageNum => (
                <button
                  key={pageNum}
                  className={`pagination-num-btn ${currentPage === pageNum ? 'active-page-num' : ''}`}
                  onClick={() => handlePageClick(pageNum)}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button 
              className="pagination-arrow-btn"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              title="Next Page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
