import { useEffect, useState } from 'react';

export const langCode = language => ({ ENG: 'en', UZ: 'uz', RU: 'ru', JP: 'jp' }[language] || 'en');
export const localized = (item, field, language) => item?.[field + '_' + langCode(language)] || item?.[field] || '';
export const categoryLabel = name => String(name || '').replaceAll('_', ' ').replace(/\bux ui\b/i, 'UX/UI');
export const navigate = url => {
  const from = location.pathname + location.search + location.hash;
  window.history.replaceState({ ...history.state, scrollY: window.scrollY }, '');
  window.history.pushState({ from }, '', url);
  window.dispatchEvent(new PopStateEvent('popstate'));
};
export function useContent(path, language = 'ENG') {
  const [version, setVersion] = useState(0);
  const [state, setState] = useState({ data: null, loading: true, error: false, key: '' });
  const key = path + language + version;
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    fetch(window.API_BASE_URL + path + (path.includes('?') ? '&' : '?') + 'lang=' + langCode(language), { signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error('Content unavailable'); return r.json(); })
      .then(data => setState({ data, loading: false, error: false, key }))
      .catch(() => { if (!controller.signal.aborted || !cancelled) setState({ data: null, loading: false, error: true, key }); })
      .finally(() => clearTimeout(timer));
    let cancelled = false;
    return () => { cancelled = true; clearTimeout(timer); controller.abort(); };
  }, [path, language, version, key]);
  return { ...state, loading: state.key !== key || state.loading, retry: () => setVersion(v => v + 1) };
}
