import { useEffect, useId, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import './LanguagePicker.css';

const languages = [['UZ', 'O‘zbekcha'], ['ENG', 'English'], ['RU', 'Русский'], ['JP', '日本語']];

export default function LanguagePicker({ language, onChange }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null), trigger = useRef(null);
  const optionsId = useId();

  useEffect(() => {
    if (!open) return;
    const dismiss = event => {
      if (!root.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [open]);

  return <><div className="language-inline" role="group" aria-label="Languages">
    {languages.map(([code]) => <button key={code} type="button" aria-pressed={language === code} onClick={() => onChange(code)}>{code}</button>)}
  </div><div ref={root} className="language-picker" onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }} onKeyDown={event => {
    if (event.key === 'Escape' && open) {
      event.preventDefault(); event.stopPropagation(); setOpen(false); trigger.current?.focus();
    }
  }}>
    <button ref={trigger} type="button" className="language-picker-trigger" aria-label={'Language: ' + language} aria-expanded={open} aria-controls={optionsId} onClick={() => setOpen(value => !value)}>
      <span>{language}</span>
    </button>
    <div id={optionsId} className={'language-options' + (open ? ' is-open' : '')} role="group" aria-label="Languages" inert={!open}>
      {languages.map(([code, label]) => <button key={code} type="button" aria-pressed={language === code} onClick={() => {
        onChange(code); setOpen(false); trigger.current?.focus();
      }}><span className="language-code">{code}</span><span>{label}</span>{language === code && <Check size={14} aria-hidden="true"/>}</button>)}
    </div>
  </div></>;
}
