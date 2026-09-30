import { RotateCcw } from 'lucide-react';
export default function ContentState({ state, language = 'ENG', empty = false }) {
  const uz = language === 'UZ';
  if (state.loading) return <div className="content-loading" role="status" aria-label={uz ? 'Yuklanmoqda' : 'Loading'}><span /><span /><span /></div>;
  if (!state.error && !empty) return null;
  return <div className="content-state" role="status"><p>{state.error ? (uz ? "Hozircha ma’lumotni yuklab bo‘lmadi." : 'This content is temporarily unavailable.') : (uz ? 'Yangi ishlar tez orada shu yerda.' : 'New work will appear here soon.')}</p>{state.error && <button className="text-button" onClick={state.retry}><RotateCcw size={15} />{uz ? 'Qayta urinish' : 'Try again'}</button>}</div>;
}
