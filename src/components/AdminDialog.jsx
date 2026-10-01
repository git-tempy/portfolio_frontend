import { useEffect, useRef, useId } from 'react';

export default function AdminDialog({ children, label, onClose }) {
  const root = useRef(null);
  const id=useId();
  const close = useRef(onClose);
  useEffect(() => { close.current = onClose; }, [onClose]);
  useEffect(() => {
    const previous = document.activeElement;
    [...root.current.querySelectorAll('label')].forEach((label,index)=>{
      const control=label.parentElement.querySelector('input,textarea,select');
      if(control&&!label.htmlFor){if(!control.id)control.id=id+'-'+index;label.htmlFor=control.id;}
    });
    const container = root.current;
    const elements = () => [...container.querySelectorAll('button,input,select,textarea,a[href]')].filter(el => !el.disabled && el.getClientRects().length);
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    (elements()[0] || container).focus();
    const keydown = event => {
      if (event.key === 'Escape') { event.preventDefault(); close.current(); }
      if (event.key === 'Tab') {
        const items = elements();
        if (!items.length) { event.preventDefault(); return; }
        const first = items[0], last = items.at(-1);
        if (event.shiftKey && (document.activeElement === first || !container.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && (document.activeElement === last || !container.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', keydown);
    return () => { document.removeEventListener('keydown', keydown); document.body.style.overflow = oldOverflow; if (previous?.isConnected) previous.focus(); };
  }, [id]);
  return <div ref={root} className="admin-modal-overlay show" role="dialog" aria-modal="true" aria-label={label} tabIndex={-1}>{children}</div>;
}
