import { useEffect, useState, useSyncExternalStore } from 'react';

// One observer and browser-state subscription serve every animated project card.
const targets = new Map();
let observer;
function observe(element, callback) {
  if (!('IntersectionObserver' in window)) { callback(true); return () => {}; }
  observer ||= new IntersectionObserver(entries => {
    entries.forEach(entry => targets.get(entry.target)?.(entry.isIntersecting));
  }, { rootMargin: '80px' });
  targets.set(element, callback);
  observer.observe(element);
  return () => {
    observer.unobserve(element);
    targets.delete(element);
    if (!targets.size) { observer.disconnect(); observer = undefined; }
  };
}
const listeners = new Set();
let media;
const notify = () => listeners.forEach(listener => listener());
function subscribe(listener) {
  if (!listeners.size) {
    media = window.matchMedia('(prefers-reduced-motion: reduce)');
    media.addEventListener('change', notify);
    document.addEventListener('visibilitychange', notify);
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      media.removeEventListener('change', notify);
      document.removeEventListener('visibilitychange', notify);
    }
  };
}
const getSnapshot = () => !document.hidden && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const noopSubscribe = () => () => {};
const disabledSnapshot = () => false;
export function useVisibleMotion(ref, enabled = true) {
  const [visible, setVisible] = useState(false);
  const allowed = useSyncExternalStore(enabled ? subscribe : noopSubscribe, enabled ? getSnapshot : disabledSnapshot, disabledSnapshot);
  useEffect(() => {
    if (!enabled || !ref.current) return;
    return observe(ref.current, setVisible);
  }, [enabled, ref]);
  return enabled && visible && allowed;
}
