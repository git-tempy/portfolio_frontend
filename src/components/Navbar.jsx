import { useEffect, useRef, useState } from 'react';
import { Sun, Moon, Menu, X, ArrowUpRight, FileText } from 'lucide-react';
import { locales } from '../locales';
import { navigate } from '../lib/content';
import LanguagePicker from './LanguagePicker';

export default function Navbar({ language, setLanguage, theme, toggleTheme, onResumeClick, view }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  const [scrolled, setScrolled] = useState(() => window.scrollY > 20);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);
  const t = locales[language] || locales.ENG;
  const items = ['about', 'experience', 'portfolio', 'contact'];
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 20);
    addEventListener('scroll', update, { passive: true });
    return () => removeEventListener('scroll', update);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    }), { rootMargin: '-20% 0px -55% 0px' });
    document.querySelectorAll('section[id]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [view]);
  useEffect(() => {
    if (!open) return;
    const desktop = matchMedia('(min-width: 1024px)');
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    menuRef.current?.querySelector('a,button')?.focus();
    const key = e => {
      if (e.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); }
      if (e.key === 'Tab') {
        const nodes = [...menuRef.current.querySelectorAll('a,button,select')];
        const first = nodes[0], last = nodes.at(-1);
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', key);
    return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', key); desktop.removeEventListener('change', closeOnDesktop); };
  }, [open]);
  const go = (e, id) => {
    e.preventDefault(); setOpen(false); setActive(id);
    if (location.pathname !== '/') navigate('/?lang=' + language + '#' + id);
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));
  };
  const links = items.map(id => <a key={id} href={'/#' + id} onClick={e => go(e, id)} aria-current={active === id ? 'location' : undefined}>{t.nav[id]}</a>);
  const languageSelect = <LanguagePicker language={language} onChange={setLanguage}/>;
  return <header className={'site-header'+(scrolled?' is-scrolled':'')}>
    <nav className="nav-shell" aria-label="Main navigation">
      <a className="brand" href="/" aria-label="DesOne home" onClick={e => go(e, 'home')}><span>des</span>one</a>
      <div className="desktop-links">{links}</div>
      <div className="nav-tools"><button className="icon-button" aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} onClick={toggleTheme}>{theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}</button>{languageSelect}<button className="icon-button navbar-resume" aria-label={t.resume} title={t.resume} onClick={onResumeClick}><FileText size={18} aria-hidden="true"/><span className="navbar-resume-label">{t.resume}</span></button><button ref={triggerRef} className="icon-button mobile-trigger" aria-label="Open menu" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(true)}><Menu size={16}/></button></div>
    </nav>
    {open && <div className="mobile-menu-backdrop" onClick={() => setOpen(false)}><div ref={menuRef} id="mobile-navigation" className="mobile-navigation" role="dialog" aria-modal="true" aria-label="Navigation" onClick={e => e.stopPropagation()}><div className="mobile-nav-top"><span className="brand"><span>des</span>one.</span><button className="icon-button" aria-label="Close menu" onClick={() => { setOpen(false); triggerRef.current?.focus(); }}><X /></button></div><div className="mobile-links">{links}</div><button className="button button-primary" onClick={() => { setOpen(false); onResumeClick(); }}>{t.resume}<ArrowUpRight size={18} /></button></div></div>}
  </header>;
}

