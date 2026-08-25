import { useState, useEffect } from 'react';
import { 
  X, Menu, ChevronLeft, ChevronRight, FileText,
  Cpu, ShieldAlert, Key, Send, TrendingUp, BarChart2
} from 'lucide-react';
import './ProjectDetailModal.css';

// Project Database for slide deck mockups and screenshot galleries
const projectDetails = {
  noq: {
    type: 'pdf',
    filename: '1779179239379-ggh9.pdf',
    title: 'NoQ pitch',
    totalPages: 5,
    slides: [
      {
        id: 1,
        title: 'No Queue',
        tagline: 'Xizmatlarni band qilish platformasi',
        description: 'NoQ (Nokyu) - Foydalanuvchilarga navbat kutmasdan oldindan xizmatlarni bron qilish imkonini beruvchi raqamli platforma.',
        theme: 'dark'
      },
      {
        id: 2,
        title: 'Muammo',
        tagline: 'O\'zbekistonda xizmat ko\'rsatish sohalarida navbatlar',
        description: 'Ko\'p joylarda hali ham uzoq jonli navbatlar va tirbandliklar mavjud.',
        points: [
          'Mijozlar kuniga o\'rtacha 30 dan 45 daqiqagacha vaqt yo\'qotishadi.',
          'Tadbirkorlar rejalashtirish qiyinligi sababli mijozlarni yo\'qotadi.',
          'Navbat jarayonlarining shaffof emasligi asabiylashishga olib keladi.'
        ],
        theme: 'gold'
      },
      {
        id: 3,
        title: 'Mijozlar vs Korxonalar',
        tagline: 'Har ikki tomonlama qiyinchiliklar',
        comparison: {
          leftTitle: 'Mijozlar muammolari',
          leftItems: [
            'Noaniq kutish vaqti',
            'Ustaning qachon bo\'shashini bilmaslik',
            'Telefon orqali band qilish qiyinchiliklari'
          ],
          rightTitle: 'Korxonalar muammolari',
          rightItems: [
            'Mijozlar oqimining to\'satdan ko\'payishi',
            'Kutish zalidagi tirbandliklar',
            'Telefon qo\'ng\'iroqlariga javob berishga vaqt sarflash'
          ]
        },
        theme: 'gray'
      },
      {
        id: 4,
        title: 'Yechim: NoQ Ilovasi',
        tagline: 'Yagona onlayn navbat ekotizimi',
        description: 'Mijozlar ilova orqali salon, shifokor yoki davlat xizmatlarini oldindan band qiladilar. Tizim navbatlarni avtomatik boshqaradi.',
        theme: 'cyan'
      },
      {
        id: 5,
        title: 'Qanday ishlaydi?',
        tagline: 'Oddiy 4 bosqichli jarayon',
        steps: [
          { number: '1', title: 'Yuklab olish', desc: 'NoQ mobil ilovasini yuklang.' },
          { number: '2', title: 'Filial tanlash', desc: 'Xaritada eng yaqin joyni tanlang.' },
          { number: '3', title: 'Bron qilish', desc: 'Usta, xizmat va vaqtni tasdiqlang.' },
          { number: '4', title: 'Xizmatdan foydalanish', desc: 'Belgilangan vaqtda borib navbatsiz foydalaning.' }
        ],
        theme: 'lime'
      }
    ]
  },
  pitch: {
    type: 'pdf',
    filename: 'investor_presentation_2026.pdf',
    title: 'Investor prezentatsiyasi',
    totalPages: 4,
    slides: [
      {
        id: 1,
        title: 'Tech Startup 2026',
        tagline: 'Series A Funding Pitch Deck',
        description: 'Retail digitalization and automation ecosystem scaling plan for Central Asia.',
        theme: 'dark'
      },
      {
        id: 2,
        title: 'Market Opportunity',
        tagline: 'The Central Asian B2B Retail Tech Gap',
        description: 'Rapidly digitalizing markets across Uzbekistan, Kazakhstan, and Kyrgyzstan represent a $450M addressable SaaS market.',
        theme: 'gold'
      },
      {
        id: 3,
        title: 'Business Model',
        tagline: 'Scalable Subscription + Monetization Pathways',
        points: [
          'Tiered SaaS pricing models for small and medium merchants ($29 - $149/mo).',
          'Integrated digital payment commissions (1.5% fee per online reservation payment).',
          'Premium merchant dashboard with detailed visual and predictive analytics.'
        ],
        theme: 'gray'
      },
      {
        id: 4,
        title: 'Growth & Scale-up Plan',
        tagline: '2026 - 2027 Strategic Roadmap',
        points: [
          'Q2 2026: Expansion into Almaty and Astana, Kazakhstan.',
          'Q4 2026: Scaling operations in Bishkek, Kyrgyzstan.',
          'Target: Reach $1.5M Annual Recurring Revenue (ARR) within 18 months.'
        ],
        theme: 'cyan'
      }
    ]
  },
  brochure: {
    type: 'image',
    title: 'Korporativ broshyura',
    images: [
      { id: 1, type: 'poster_balloon', title: 'Nashi Shariki Poster' },
      { id: 2, type: 'testers_arcade', title: 'Testers Retro Arcade UI' },
      { id: 3, type: 'brochure_mockup', title: 'Corporate Folder Print Preview' }
    ]
  },
  startup: {
    type: 'image',
    title: 'Tech Startup sayti',
    images: [
      { id: 1, type: 'landing_hero', title: 'Startup Landing Hero Page' },
      { id: 2, type: 'feature_cards', title: 'Features and Services Section' },
      { id: 3, type: 'pricing_table', title: 'Subscription Plans Table' }
    ]
  },
  fintech: {
    type: 'image',
    title: 'Fintech ilovasi',
    images: [
      { id: 1, type: 'fintech_home', title: 'Visa Card & Wallet Balance' },
      { id: 2, type: 'fintech_transfer', title: 'Instant Mobile Transfer Screen' },
      { id: 3, type: 'fintech_analytics', title: 'Neon Expense Analytics Chart' }
    ]
  },
  dashboard: {
    type: 'image',
    title: 'SaaS dashboard',
    images: [
      { id: 1, type: 'dashboard_metrics', title: 'Analytics KPIs & Revenues' },
      { id: 2, type: 'dashboard_tokens', title: 'API Access Token Management' },
      { id: 3, type: 'dashboard_server', title: 'Server CPU & Load Dials' }
    ]
  }
};

export default function ProjectDetailModal({ projectId, projectKey, onClose }) {
  const [dbProject, setDbProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoom, setZoom] = useState(() => (typeof window !== 'undefined' && window.innerWidth <= 768 ? 45 : 85));
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 1. Fetch project from backend API if ID is passed
  useEffect(() => {
    // Body scroll lock
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';

    if (projectId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(true);
      fetch(`${window.API_BASE_URL}/api/portfolio/projects/${projectId}/`)
        .then(res => res.json())
        .then(data => {
          setDbProject(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching project details:', err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }

    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    };
  }, [projectId]);

  if (loading) {
    return (
      <div className="pdf-viewer-overlay">
        <div className="loading-spinner-wrapper">
          <div className="admin-loading-spinner"></div>
        </div>
      </div>
    );
  }

  // 2. Resolve target project config
  let project = null;
  let normalizedKey = '';

  if (dbProject) {
    // Match title to demo keys for high-fidelity fallback rendering
    const titleLower = dbProject.title.toLowerCase();
    if (titleLower.includes('noq')) {
      normalizedKey = 'noq';
    } else if (titleLower.includes('brochure') || titleLower.includes('broshyura')) {
      normalizedKey = 'brochure';
    } else if (titleLower.includes('startup')) {
      normalizedKey = 'startup';
    } else if (titleLower.includes('fintech')) {
      normalizedKey = 'fintech';
    } else if (titleLower.includes('dashboard')) {
      normalizedKey = 'dashboard';
    } else if (titleLower.includes('pitch') || titleLower.includes('prezentatsiya')) {
      normalizedKey = 'pitch';
    }

    if (normalizedKey && projectDetails[normalizedKey]) {
      project = projectDetails[normalizedKey];
    } else {
      // It's a custom uploaded database project
      let projectImages = dbProject.images || [];
      if (projectImages.length === 0 && dbProject.cover_image) {
        projectImages = [{ id: 'cover', image: dbProject.cover_image }];
      } else if (projectImages.length === 0 && dbProject.file) {
        projectImages = [{ id: 'file', image: dbProject.file }];
      }

      project = {
        isCustom: true,
        type: dbProject.type, // 'pdf' or 'image'
        title: dbProject.title,
        filename: dbProject.file ? dbProject.file.split('/').pop() : 'project_file',
        fileUrl: dbProject.file,
        coverUrl: dbProject.cover_image,
        totalPages: dbProject.total_pages || 1,
        images: projectImages
      };
    }
  } else if (projectKey) {
    normalizedKey = projectKey.replace('_dup', '');
    project = projectDetails[normalizedKey];
  }

  if (!project) return null;

  // Next/Prev for Image Lightbox
  const handleNext = () => {
    const imagesCount = project.images ? project.images.length : 1;
    setActiveIndex(prev => (prev === imagesCount - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    const imagesCount = project.images ? project.images.length : 1;
    setActiveIndex(prev => (prev === 0 ? imagesCount - 1 : prev - 1));
  };

  // Render HTML mockup graphics dynamically to match screenshots
  const renderMockup = (type) => {
    switch (type) {
      // 1. BALLOON POSTER (Second Screenshot)
      case 'poster_balloon':
        return (
          <div className="mockup-poster-balloon">
            <div className="watercolor-bg"></div>
            <div className="balloon-cluster">
              <div className="balloon balloon-1"></div>
              <div className="balloon balloon-2"></div>
              <div className="balloon balloon-3"></div>
              <div className="balloon balloon-4"></div>
              <div className="balloon balloon-5"></div>
              <div className="balloon-ribbon-bow"></div>
            </div>
            <div className="gold-diamond-frame">
              <div className="poster-title-cursive">Nashi</div>
              <div className="poster-title-cursive second-word">Shariki</div>
            </div>
            <p className="poster-description-text">
              Sifatli, uzoq turadigan chiroyli fotozona va kompozitsiyalar
            </p>
            <div className="poster-contacts">
              <div className="contact-item">
                <span className="contact-icon icon-insta">📸</span>
                <span className="contact-label">nashi_shariki</span>
              </div>
              <div className="contact-item tel-item">
                <span className="contact-icon icon-tel">📞</span>
                <span className="contact-numbers">99 787 3909 <br/> 94 635 3240</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon icon-tg">✈️</span>
                <span className="contact-label">surprice_uz</span>
              </div>
            </div>
          </div>
        );

      // 2. RETRO ARCADE SCREEN
      case 'testers_arcade':
        return (
          <div className="mockup-arcade-screen">
            <div className="arcade-glow-ring">
              <svg viewBox="0 0 100 100" className="arcade-smiley">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#CCFF33" strokeWidth="2" strokeDasharray="3 3"/>
                <rect x="35" y="35" width="6" height="6" fill="#CCFF33" />
                <rect x="59" y="35" width="6" height="6" fill="#CCFF33" />
                <path d="M 35 60 Q 50 75 65 60" fill="none" stroke="#CCFF33" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>
            <div className="arcade-matrix-grid"></div>
            <div className="arcade-hud-header">
              <span className="hud-label">SCORE: 9540</span>
              <span className="hud-label title">RETRO PLAY</span>
              <span className="hud-label">LIVES: III</span>
            </div>
            <div className="arcade-character-sprite"></div>
          </div>
        );

      // 3. BROCHURE MOCKUP PRINT
      case 'brochure_mockup':
        return (
          <div className="mockup-brochure-print">
            <div className="brochure-left-page">
              <h5>VISUAL GUIDELINES</h5>
              <div className="color-palette-strips">
                <div className="palette-strip col-1"></div>
                <div className="palette-strip col-2"></div>
                <div className="palette-strip col-3"></div>
              </div>
              <div className="brochure-lorem-box"></div>
              <div className="brochure-lorem-box short"></div>
            </div>
            <div className="brochure-right-page">
              <div className="brochure-isometric-graphic"></div>
              <h5>CASY PRINT CO.</h5>
            </div>
          </div>
        );

      // 4. LANDING HERO
      case 'landing_hero':
        return (
          <div className="mockup-landing-hero">
            <div className="landing-nav-bar">
              <span className="landing-nav-logo">casy.io</span>
              <div className="landing-nav-dummy-links"><span>About</span><span>Features</span><span>Pricing</span></div>
              <span className="landing-nav-btn">Get Started</span>
            </div>
            <div className="landing-hero-center-content">
              <span className="landing-badge">V2.4 RELEASE</span>
              <h2>Automate Your SaaS <br/> Analytics Pipeline</h2>
              <p>Connect pipelines, deploy integrations, and analyze trends instantly.</p>
              <div className="landing-cta-row">
                <span className="landing-cta-primary">Deploy Now</span>
                <span className="landing-cta-secondary">View Docs</span>
              </div>
            </div>
            <div className="landing-glow-orb-mock"></div>
          </div>
        );

      // 5. FEATURE CARDS
      case 'feature_cards':
        return (
          <div className="mockup-feature-cards">
            <div className="feature-grid-header">
              <h3>Core Features Built for Scale</h3>
              <p>Everything you need to monitor high performance systems.</p>
            </div>
            <div className="feature-cards-grid">
              <div className="feat-card">
                <div className="feat-icon icon-cpu"><Cpu size={20} /></div>
                <h5>Auto Scaling</h5>
                <div className="feat-dummy-line"></div>
                <div className="feat-dummy-line short"></div>
              </div>
              <div className="feat-card">
                <div className="feat-icon icon-shield"><ShieldAlert size={20} /></div>
                <h5>AES Encryption</h5>
                <div className="feat-dummy-line"></div>
                <div className="feat-dummy-line short"></div>
              </div>
              <div className="feat-card">
                <div className="feat-icon icon-key"><Key size={20} /></div>
                <h5>Access Tokens</h5>
                <div className="feat-dummy-line"></div>
                <div className="feat-dummy-line short"></div>
              </div>
            </div>
          </div>
        );

      // 6. PRICING TABLE
      case 'pricing_table':
        return (
          <div className="mockup-pricing-table">
            <div className="price-card">
              <span className="price-tier">BASIC</span>
              <h4>$29/mo</h4>
              <div className="price-divider"></div>
              <div className="price-lines"><div className="price-line"></div><div className="price-line"></div></div>
              <span className="price-btn">Choose Plan</span>
            </div>
            <div className="price-card featured-price">
              <span className="price-badge">POPULAR</span>
              <span className="price-tier">PRO</span>
              <h4>$79/mo</h4>
              <div className="price-divider"></div>
              <div className="price-lines"><div className="price-line"></div><div className="price-line"></div><div className="price-line"></div></div>
              <span className="price-btn">Choose Plan</span>
            </div>
          </div>
        );

      // 7. FINTECH HOME
      case 'fintech_home':
        return (
          <div className="mockup-fintech-home">
            <div className="fintech-mobile-header">
              <div className="user-avatar-placeholder"></div>
              <div className="header-greeting"><span>Salom, Feruzxon</span><span>Art Director</span></div>
              <span className="notif-bell">🔔</span>
            </div>
            <div className="fintech-visa-card">
              <div className="visa-logo-wrap"><span>VISA</span><span className="platinum-tag">PLATINUM</span></div>
              <span className="card-balance-label">Total Balance</span>
              <h3>$45,820.00</h3>
              <span className="card-number-hidden">•••• •••• •••• 9012</span>
            </div>
            <div className="fintech-quick-actions">
              <div className="action-circle"><span>📤</span><span>Send</span></div>
              <div className="action-circle"><span>📥</span><span>Receive</span></div>
              <div className="action-circle"><span>📊</span><span>Analytics</span></div>
              <div className="action-circle"><span>⚙️</span><span>Settings</span></div>
            </div>
          </div>
        );

      // 8. FINTECH TRANSFER
      case 'fintech_transfer':
        return (
          <div className="mockup-fintech-transfer">
            <div className="transfer-card-header">
              <h4>Quick Transfer</h4>
              <span className="all-contacts-link">View All</span>
            </div>
            <div className="recent-recipients-row">
              <div className="recipient-profile-wrap active-rec"><div className="rec-pic pic-1"></div><span>Asror</span></div>
              <div className="recipient-profile-wrap"><div className="rec-pic pic-2"></div><span>Dilshod</span></div>
              <div className="recipient-profile-wrap"><div className="rec-pic pic-3"></div><span>Shoxrux</span></div>
              <div className="recipient-profile-wrap"><div className="rec-pic pic-4"></div><span>Nilufar</span></div>
            </div>
            <div className="amount-input-box">
              <span className="amount-currency">$</span>
              <input type="text" value="1,250" readOnly />
            </div>
            <button className="confirm-transfer-btn"><Send size={14} /><span>Confirm & Send</span></button>
          </div>
        );

      // 9. FINTECH ANALYTICS
      case 'fintech_analytics':
        return (
          <div className="mockup-fintech-analytics">
            <div className="analytics-header"><h4>Monthly Analytics</h4><span className="trend-percentage"><TrendingUp size={12} /> +12.4%</span></div>
            <div className="neon-chart-canvas">
              <div className="neon-grid-lines">
                <div className="grid-line-hor"></div>
                <div className="grid-line-hor"></div>
                <div className="grid-line-hor"></div>
              </div>
              <svg viewBox="0 0 100 50" className="neon-chart-curve">
                <path d="M 0 45 Q 20 20 40 35 T 80 15 T 100 5" fill="none" stroke="#CCFF33" strokeWidth="2.5" />
                <path d="M 0 45 Q 20 20 40 35 T 80 15 T 100 5 L 100 50 L 0 50 Z" fill="rgba(204, 255, 51, 0.08)" />
              </svg>
            </div>
            <div className="chart-legend-row"><span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span></div>
          </div>
        );

      // 10. DASHBOARD METRICS
      case 'dashboard_metrics':
        return (
          <div className="mockup-dashboard-metrics">
            <div className="metrics-top-grid">
              <div className="metric-box">
                <span className="metric-lbl">TOTAL VISITS</span>
                <h4>142,850</h4>
                <span className="metric-trend up"><TrendingUp size={12} /> +8.2%</span>
              </div>
              <div className="metric-box">
                <span className="metric-lbl">MONTHLY REVENUE</span>
                <h4>$18,450.00</h4>
                <span className="metric-trend up"><TrendingUp size={12} /> +15.4%</span>
              </div>
            </div>
            <div className="dashboard-bars-chart">
              <div className="bar-graph-header"><span>Sales Performance</span><BarChart2 size={16} /></div>
              <div className="bar-graph-columns">
                <div className="bar-col"><div className="bar-fill fill-1"></div><span>Jan</span></div>
                <div className="bar-col"><div className="bar-fill fill-2"></div><span>Feb</span></div>
                <div className="bar-col"><div className="bar-fill fill-3"></div><span>Mar</span></div>
                <div className="bar-col"><div className="bar-fill fill-4"></div><span>Apr</span></div>
              </div>
            </div>
          </div>
        );

      // 11. DASHBOARD TOKENS
      case 'dashboard_tokens':
        return (
          <div className="mockup-dashboard-tokens">
            <div className="tokens-header-bar">
              <h4>API Access Tokens</h4>
              <span className="btn-add-token">+ Add Token</span>
            </div>
            <div className="tokens-list-table">
              <div className="token-row">
                <div className="token-meta"><span>Client Production Key</span><code>pk_live_f7h3...</code></div>
                <span className="status-pill status-active">Active</span>
              </div>
              <div className="token-row">
                <div className="token-meta"><span>Client Testing Key</span><code>pk_test_88gh...</code></div>
                <span className="status-pill status-revoked">Revoked</span>
              </div>
            </div>
          </div>
        );

      // 12. DASHBOARD SERVER LOAD
      case 'dashboard_server':
        return (
          <div className="mockup-dashboard-server">
            <div className="server-status-grid">
              <div className="status-dial-card">
                <span className="dial-label">SERVER CPU LOAD</span>
                <div className="circular-progress-dial"><div className="dial-value-text">42%</div></div>
              </div>
              <div className="status-dial-card">
                <span className="dial-label">MEMORY USAGE</span>
                <div className="circular-progress-dial"><div className="dial-value-text">68%</div></div>
              </div>
            </div>
            <div className="terminal-logs-window">
              <div className="logs-header"><span>Tizim loglari (Live)</span><span className="green-ping-dot"></span></div>
              <div className="logs-terminal">
                <div className="log-line"><code>[21:49:12] INFO: Incoming request from 178.21.32.12 (GET /api/v1/users)</code></div>
                <div className="log-line"><code>[21:49:13] SUCCESS: db connection pooled in 12ms. Status: OK</code></div>
                <div className="log-line"><code>[21:49:15] WARN: CPU load spike detected on node_03. Scaling...</code></div>
                <div className="log-line"><code>[21:49:16] INFO: Spawning docker instances count: 4</code></div>
              </div>
            </div>
          </div>
        );

      default:
        return <div className="mockup-default-placeholder">Template Not Found</div>;
    }
  };

  // RENDER SLIDE CONTENT FOR PDF VIEWER
  const renderSlideContent = (slide) => {
    return (
      <div className={`pdf-slide-render theme-${slide.theme}`}>
        <div className="slide-mesh-effect"></div>
        <div className="slide-glow-dot"></div>

        <div className="slide-content-layout">
          <span className="slide-tag">{slide.tagline || 'NoQ Presentation'}</span>
          <h2 className="slide-title">{slide.title}</h2>
          
          {slide.description && (
            <p className="slide-description-para">{slide.description}</p>
          )}

          {slide.points && (
            <ul className="slide-bullet-list">
              {slide.points.map((pt, idx) => (
                <li key={idx} className="slide-bullet-item">{pt}</li>
              ))}
            </ul>
          )}

          {slide.comparison && (
            <div className="slide-comparison-wrapper">
              <div className="comparison-col">
                <h6>{slide.comparison.leftTitle}</h6>
                <ul>
                  {slide.comparison.leftItems.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="comparison-col">
                <h6>{slide.comparison.rightTitle}</h6>
                <ul>
                  {slide.comparison.rightItems.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {slide.steps && (
            <div className="slide-steps-grid">
              {slide.steps.map((st, idx) => (
                <div key={idx} className="slide-step-card">
                  <div className="step-circle">{st.number}</div>
                  <h6>{st.title}</h6>
                  <p>{st.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Displaying visual mockup elements inside slide 1 of NoQ to match PDF Screenshot */}
        {slide.id === 1 && normalizedKey === 'noq' && (
          <div className="slide-visual-overlay">
            <div className="min-phone-mock">
              <div className="phone-screen-screen">
                <span className="mock-title">Luna Hair Salon</span>
                <span className="mock-btn-book">Quick Book</span>
              </div>
            </div>
            <div className="min-phone-mock second-phone">
              <div className="phone-screen-screen">
                <span className="mock-title">Gentlemen's Cut</span>
                <span className="mock-btn-book">Book Slot</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 1. PDF / PRESENTATION VIEWER DETAIL DESIGN
  if (project.type === 'pdf') {
    const activeSlide = !project.isCustom ? project.slides[activeIndex] : null;
    return (
      <div className="pdf-viewer-overlay" onClick={onClose} onContextMenu={(e) => e.preventDefault()}>
        <div className="pdf-viewer-window" onClick={(e) => e.stopPropagation()}>
          {/* Top PDF Header Toolbar */}
          <div className="pdf-viewer-top-toolbar">
            <div className="toolbar-left-side">
              <button 
                className="toolbar-btn sidebar-toggle-btn"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                title="Sidebar Toggle"
              >
                <Menu size={18} />
              </button>
              <span className="toolbar-filename-text">{project.isCustom ? project.title : project.filename}</span>
            </div>
            
            <div className="toolbar-center-side">
              <span className="slide-page-counter">
                {activeIndex + 1} / {project.totalPages}
              </span>
              {!project.isCustom && (
                <>
                  <div className="toolbar-divider"></div>
                  <div className="zoom-adjuster">
                    <button 
                      onClick={() => setZoom(prev => Math.max(20, prev - 5))}
                      className="toolbar-btn zoom-minus"
                    >-</button>
                    <span className="zoom-percentage-text">{zoom}%</span>
                    <button 
                      onClick={() => setZoom(prev => Math.min(100, prev + 5))}
                      className="toolbar-btn zoom-plus"
                    >+</button>
                  </div>
                </>
              )}
            </div>

            <div className="toolbar-right-side">
              <button className="toolbar-btn close-toolbar-btn" onClick={onClose} title="Close"><X size={18} /></button>
            </div>
          </div>

          <div className="pdf-viewer-content-layout">
            {/* Left Slides Sidebar */}
            <div className={`pdf-viewer-sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
              <div className="sidebar-thumbnails-scroll">
                {project.isCustom ? (
                  Array.from({ length: project.totalPages || 1 }, (_, idx) => idx + 1).map((pageNum, index) => (
                    <div 
                      key={pageNum} 
                      className={`sidebar-thumb-card-wrapper ${index === activeIndex ? 'thumb-active' : ''}`}
                      onClick={() => setActiveIndex(index)}
                    >
                      <div className="sidebar-thumb-preview">
                        <div className="thumb-slide-mini custom-pdf-thumb">
                          <FileText size={18} className="pdf-thumb-file-icon" style={{ color: index === activeIndex ? '#CCFF33' : 'rgba(255, 255, 255, 0.4)' }} />
                          <div className="mini-text-line"></div>
                          <div className="mini-text-line short"></div>
                        </div>
                      </div>
                      <span className="thumb-page-number-label">{pageNum}</span>
                    </div>
                  ))
                ) : (
                  project.slides.map((slide, index) => (
                    <div 
                      key={slide.id} 
                      className={`sidebar-thumb-card-wrapper ${index === activeIndex ? 'thumb-active' : ''}`}
                      onClick={() => setActiveIndex(index)}
                    >
                      <div className="sidebar-thumb-preview">
                        <div className={`thumb-slide-mini theme-${slide.theme}`}>
                          <div className="mini-title-line"></div>
                          <div className="mini-text-line"></div>
                          <div className="mini-text-line short"></div>
                        </div>
                      </div>
                      <span className="thumb-page-number-label">{index + 1}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Central Slide Canvas Display Area */}
            <div className="pdf-viewer-canvas-display" style={project.isCustom ? { overflow: 'hidden' } : {}}>
              {project.isCustom ? (
                <div className="pdf-custom-iframe-container" style={{ width: '100%', height: '100%', position: 'relative' }}>
                  {project.fileUrl ? (
                    <iframe 
                      src={`${project.fileUrl}#page=${activeIndex + 1}&toolbar=0&navpanes=0`} 
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      title={project.title}
                      key={activeIndex}
                    />
                  ) : (
                    <div className="mockup-default-placeholder">No PDF File Uploaded</div>
                  )}
                  {/* Security transparent overlay */}
                  <div className="pdf-slide-security-cover" onContextMenu={(e) => e.preventDefault()}></div>
                </div>
              ) : (
                <div 
                  className="pdf-slide-container"
                  style={{ 
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'top center'
                  }}
                >
                  <div className="pdf-slide-content-wrapper">
                    {renderSlideContent(activeSlide)}
                    {/* Security transparent overlay */}
                    <div className="pdf-slide-security-cover" onContextMenu={(e) => e.preventDefault()}></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. IMAGE GALLERY LIGHTBOX DETAIL DESIGN
  const activeImage = project.images && project.images[activeIndex];
  return (
    <div className="gallery-lightbox-overlay" onClick={onClose} onContextMenu={(e) => e.preventDefault()}>
      {/* Top right close button */}
      <button className="lightbox-close-btn" onClick={onClose} title="Close Gallery">
        <X size={24} />
      </button>

      {/* Main viewport with arrow keys */}
      <div className="lightbox-viewport-container" onClick={(e) => e.stopPropagation()}>
        {project.images && project.images.length > 1 && (
          <button 
            className="lightbox-nav-arrow arrow-left" 
            onClick={handlePrev}
            title="Previous Image"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div className="lightbox-image-canvas">
          <div className="canvas-mockup-wrapper" style={project.isCustom ? { display: 'flex', justifyContent: 'center', alignItems: 'center' } : {}}>
            {project.isCustom ? (
              activeImage ? (
                <img 
                  src={activeImage.image} 
                  alt={project.title} 
                  className="lightbox-custom-img"
                />
              ) : (
                <div className="mockup-default-placeholder">No Image Available</div>
              )
            ) : (
              activeImage && renderMockup(activeImage.type)
            )}
            {/* Security overlay */}
            <div className="lightbox-security-overlay" onContextMenu={(e) => e.preventDefault()}></div>
          </div>
        </div>

        {project.images && project.images.length > 1 && (
          <button 
            className="lightbox-nav-arrow arrow-right" 
            onClick={handleNext}
            title="Next Image"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      {/* Bottom thumbnails slider */}
      {project.images && project.images.length > 1 && (
        <div className="lightbox-bottom-toolbar" onClick={(e) => e.stopPropagation()}>
          <div className="lightbox-thumbnails-carousel">
            {project.images.map((img, index) => (
              <div 
                key={img.id}
                className={`lightbox-thumb-container ${index === activeIndex ? 'thumb-highlight' : ''}`}
                onClick={() => setActiveIndex(index)}
              >
                <div className="lightbox-thumb-mini">
                  {project.isCustom ? (
                    <img src={img.image} alt="" className="lightbox-thumb-img-preview" />
                  ) : (
                    <div className={`mini-mock-box mock-type-${img.type}`}></div>
                  )}
                </div>
                <span className="lightbox-thumb-number">{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
