import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutCertificates from './components/AboutCertificates';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import AllProjects from './components/AllProjects';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ResumeModal from './components/ResumeModal';
import ProjectDetailModal from './components/ProjectDetailModal';
import './App.css';

function App() {
  const [language, setLanguage] = useState('UZ');
  const [theme, setTheme] = useState('dark');
  const [currentView, setCurrentView] = useState('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [initialSearchTerm, setInitialSearchTerm] = useState('');
  const [selectedProjectSlug, setSelectedProjectSlug] = useState(null);
  const [dbAbout, setDbAbout] = useState(null);
  const [showWelcomeAlert, setShowWelcomeAlert] = useState(false);

  // Helper to inform Django of the selected language
  const syncLanguageToBackend = (lang) => {
    fetch(window.API_BASE_URL + '/i18n/setlang/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `language=${lang.toLowerCase()}`,
      credentials: 'include',
    }).catch(() => {});
  };

  // Initialise language from URL, localStorage or default
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    const storedLang = localStorage.getItem('lang');
    const initLang = urlLang || storedLang || 'UZ';
    setLanguage(initLang);
    // Persist to URL and localStorage
    urlParams.set('lang', initLang);
    window.history.replaceState(null, '', `${window.location.pathname}?${urlParams.toString()}`);
    localStorage.setItem('lang', initLang);
    syncLanguageToBackend(initLang);
  }, []);

  // Wrapper to change language from UI
  const changeLanguage = (lang) => {
    setLanguage(lang);
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('lang', lang);
    window.history.replaceState(null, '', `${window.location.pathname}?${urlParams.toString()}`);
    localStorage.setItem('lang', lang);
    syncLanguageToBackend(lang);
  };

  const fetchAboutData = async () => {
    try {
      const response = await fetch(window.API_BASE_URL + '/api/about/');
      if (response.ok) {
        const data = await response.json();
        setDbAbout(data);
      }
    } catch (err) {
      console.error('Error fetching about me data from backend:', err);
    }
  };

  const logVisitor = async () => {
    try {
      await fetch(window.API_BASE_URL + '/api/visitor/log/', { method: 'POST' });
    } catch (err) {
      console.error('Error logging visitor:', err);
    }
  };

  const handleWelcomeClose = () => {
    localStorage.setItem('desone_welcomed_v2', 'true');
    logVisitor();
    setShowWelcomeAlert(false);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    fetchAboutData();
    
    // Show welcome alert only for first-time visitors on public pages
    const isAdminPage = window.location.pathname === '/desone_adminstration';
    const hasBeenWelcomed = localStorage.getItem('desone_welcomed_v2');
    if (!hasBeenWelcomed && !isAdminPage) {
      setShowWelcomeAlert(true);
    }
  }, []);

  // Listen to path changes for Admin panel and Portfolio routing
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      if (path === '/desone_adminstration') {
        if (isAdminLoggedIn) {
          setCurrentView('admin-dashboard');
        } else {
          setCurrentView('admin-login');
        }
      } else if (path.startsWith('/portfolio/')) {
        const slug = path.split('/portfolio/')[1];
        if (slug) {
          setCurrentView('project-detail');
          setSelectedProjectSlug(slug);
        }
      } else {
        if (['admin-login', 'admin-dashboard', 'project-detail'].includes(currentView)) {
          setCurrentView('home');
        }
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    handleLocationChange(); // Initial check on mount

    return () => window.removeEventListener('popstate', handleLocationChange);
  }, [isAdminLoggedIn, currentView]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setCurrentView('admin-dashboard');
    window.history.pushState(null, '', '/desone_adminstration');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentView('home');
    window.history.pushState(null, '', '/');
  };

  const handleAdminBack = () => {
    setCurrentView('home');
    window.history.pushState(null, '', '/');
  };

  const showPublicNavbar = currentView !== 'admin-login' && currentView !== 'admin-dashboard' && currentView !== 'project-detail';

  return (
    <>
      {/* Dynamic Ambient Blur Orbs */}
      {showPublicNavbar && (
        <div className="ambient-glows">
          <div className="glow-orb glow-orb-1"></div>
          <div className="glow-orb glow-orb-4"></div>
        </div>
      )}

      {/* Main Glassmorphic Navigation */}
      {showPublicNavbar && (
        <Navbar
          language={language}
          setLanguage={changeLanguage}
          theme={theme}
          toggleTheme={toggleTheme}
          currentView={currentView}
          setCurrentView={setCurrentView}
          onResumeClick={() => setShowResume(true)}
        />
      )}

      {/* Main Pages */}
      <main style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {currentView === 'home' ? (
          <>
            <Hero language={language} />
            <AboutCertificates language={language} dbAbout={dbAbout} />
            <Skills language={language} />
            <Experience language={language} />
            <Portfolio
              language={language}
              onViewAll={(tag) => {
                setInitialSearchTerm(tag || '');
                setCurrentView('portfolio-all');
              }}
            />
            <Contact language={language} />
          </>
        ) : currentView === 'portfolio-all' ? (
          <AllProjects
            language={language}
            initialSearch={initialSearchTerm}
            onBack={() => {
              setInitialSearchTerm('');
              setCurrentView('home');
            }}
          />
        ) : currentView === 'admin-login' ? (
          <AdminLogin
            language={language}
            onLoginSuccess={handleAdminLoginSuccess}
            onBack={handleAdminBack}
          />
        ) : currentView === 'admin-dashboard' ? (
          <AdminDashboard
            language={language}
            onLogout={handleAdminLogout}
            dbAbout={dbAbout}
            onAboutUpdate={fetchAboutData}
          />
        ) : currentView === 'project-detail' ? (
          <ProjectDetailModal
            projectId={selectedProjectSlug}
            onClose={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                window.history.pushState(null, '', '/');
                window.dispatchEvent(new Event('popstate'));
              }
            }}
          />
        ) : null}
      </main>

      {/* Interactive Resume PDF modal */}
      {showResume && (
        <ResumeModal
          language={language}
          onClose={() => setShowResume(false)}
          resumeUrl={dbAbout?.resume_pdf}
        />
      )}

      {/* Premium Welcome Alert Popup */}
      {showWelcomeAlert && (
        <div className="welcome-alert-overlay">
          <div className="welcome-alert-card">
            <div className="welcome-card-glow" />
            <div className="welcome-logo-wrap">
              <span className="welcome-logo-des">des</span><span className="welcome-logo-one">one</span>
            </div>
            <h2 className="welcome-title">Welcome to DesOne Portfolio</h2>
            <p className="welcome-text">
              Explore a showcase of premium digital design, visual identity, and art direction.
            </p>
            <button className="welcome-close-btn" onClick={handleWelcomeClose}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
