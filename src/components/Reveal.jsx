import { motion, useReducedMotion } from 'framer-motion';

// Motion values follow responsive-show-suite; reduced motion keeps all content visible.
export default function Reveal({ as = 'div', children, x = 0, y = 20, scale = 1, duration = .5, delay = 0, amount = .15, immediate = false, ...props }) {
  const reduced = useReducedMotion();
  const Component = motion[as];
  const visible = { opacity: 1, x: 0, y: 0, scale: 1 };
  return <Component {...props}
    initial={reduced ? false : { opacity: 0, x, y, scale }}
    animate={immediate || reduced ? visible : undefined}
    whileInView={immediate ? undefined : visible}
    viewport={{ once: true, amount }}
    transition={{ duration: reduced ? 0 : duration, delay: reduced ? 0 : delay }}
  >{children}</Component>;
}
