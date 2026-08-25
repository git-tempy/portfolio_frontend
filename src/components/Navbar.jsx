import { useState, useEffect } from 'react';
import { Sun, Moon, FileText, Menu, X } from 'lucide-react';
import { locales } from '../locales';
import './Navbar.css';

const Navbar = ({ language, setLanguage, theme, toggleTheme, currentView, setCurrentView, onResumeClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const t = locales[language];

  const handleLangChange = (lang) => {
    setLanguage(lang);
  };

  const handleLogoClick = () => {
    if (currentView !== 'home') {
      setCurrentView('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavLinkClick = (e, targetId) => {
    if (currentView !== 'home') {
      e.preventDefault();
      setCurrentView('home');
      setTimeout(() => {
        const element = document.querySelector(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    }
  };

  const navItems = [
    { key: 'home', id: '#home' },
    { key: 'about', id: '#about' },
    { key: 'education', id: '#education' },
    { key: 'skills', id: '#skills' },
    { key: 'experience', id: '#experience' },
    { key: 'portfolio', id: '#portfolio' },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container navbar-inner">
          {/* Logo */}
          <div className="logo" onClick={handleLogoClick}>
            <span className="logo-des">des</span>
            <span className="logo-one">one</span>
          </div>

          {/* Desktop Nav Links */}
          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.key}>
                <a 
                  href={item.id} 
                  className="nav-link"
                  onClick={(e) => handleNavLinkClick(e, item.id)}
                >
                  {t.nav[item.key]}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop Actions */}
          <div className="nav-actions">
            {/* Language Selector */}
            <div className="lang-selector">
              {['UZ', 'ENG', 'RU', 'JP'].map((lang) => (
                <button
                  key={lang}
                  className={`lang-btn ${language === lang ? 'active' : ''}`}
                  onClick={() => handleLangChange(lang)}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Theme Toggle */}
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun /> : <Moon />}
            </button>

            {/* Resume Button */}
            <button className="resume-button" onClick={onResumeClick}>
              <FileText />
              {t.resume}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)}>
        <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
          <ul className="mobile-nav-links">
            {navItems.map((item) => (
              <li key={item.key}>
                <a
                  href={item.id}
                  className="mobile-nav-link"
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleNavLinkClick(e, item.id);
                  }}
                >
                  {t.nav[item.key]}
                </a>
              </li>
            ))}
          </ul>

          <div className="mobile-nav-actions">
            {/* Language Selector */}
            <div className="lang-selector">
              {['UZ', 'ENG', 'RU', 'JP'].map((lang) => (
                <button
                  key={lang}
                  className={`lang-btn ${language === lang ? 'active' : ''}`}
                  onClick={() => {
                    handleLangChange(lang);
                    setMobileMenuOpen(false);
                  }}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Theme Toggle & Resume Button */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
              <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                {theme === 'dark' ? <Sun /> : <Moon />}
              </button>
            </div>

            <button className="resume-button" onClick={onResumeClick}>
              <FileText />
              {t.resume}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
