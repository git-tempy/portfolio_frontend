import { useEffect, useRef, useState } from 'react';

export default function Reveal({ as: Component = 'div', children, x = 0, y = 20, scale = 1, duration = .5, delay = 0, amount = .15, immediate = false, style, ...props }) {
  const element = useRef(null);
  const entered = useRef(false);
  const [visible, setVisible] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const node = element.current;
    if (!node || entered.current) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer, animation;
    const show = () => {
      if (entered.current) return;
      entered.current = true;
      observer?.disconnect();
      setVisible(true);
      if (!preference.matches && node.animate) {
        animation = node.animate([
          { opacity: 0, transform: `translate(${x}px, ${y}px) scale(${scale})` },
          { opacity: 1, transform: 'none' },
        ], { duration: Math.max(0, duration) * 1000, delay: Math.max(0, delay) * 1000, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'both' });
        animation.onfinish = () => animation.cancel();
      }
    };
    const reduce = () => { if (preference.matches) { animation?.cancel(); show(); } };
    preference.addEventListener('change', reduce);
    if (immediate || preference.matches || !window.IntersectionObserver) show();
    else {
      observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) show(); }, { threshold: Math.max(0, Math.min(1, amount)) });
      observer.observe(node);
    }
    return () => { observer?.disconnect(); animation?.cancel(); preference.removeEventListener('change', reduce); };
  }, [x, y, scale, duration, delay, amount, immediate]);
  return <Component {...props} ref={element} style={{ ...style, opacity: visible ? style?.opacity ?? 1 : 0 }}>{children}</Component>;
}
