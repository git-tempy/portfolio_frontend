import { useRef } from 'react';
import { FileText, Eye, Upload, Trash2 } from 'lucide-react';
const labels = {
 UZ:['Yuklangan PDF','PDF tanlash','Ko‘rish','Almashtirish','O‘chirish','PDF tanlanmagan'],
 RU:['Загруженный PDF','Выбрать PDF','Просмотр','Заменить','Удалить','PDF не выбран'],
 ENG:['Uploaded PDF','Choose PDF','View','Replace','Remove','No PDF selected'],
 JP:['アップロード済みPDF','PDFを選択','表示','差し替え','削除','PDF未選択']
};
export default function ProjectPdfUpload({language,file,existing,removed,onChange,onRemove,disabled}) {
 const input=useRef(null),t=labels[language]||labels.ENG;
 const hasFile=!!file||!!existing&&!removed;
 return <div className="project-pdf-upload">
  <input ref={input} type="file" accept="application/pdf" hidden onChange={e=>{onChange(e.target.files?.[0]||null);e.target.value='';}}/>
  <div className="project-pdf-summary"><FileText size={24}/><div><strong>{hasFile?t[0]:t[5]}</strong><small>{file?file.name:'PDF'}</small></div></div>
  <div className="project-pdf-actions">
   {!file&&existing&&!removed&&<a href={existing} target="_blank" rel="noopener noreferrer"><Eye size={16}/>{t[2]}</a>}
   <button type="button" disabled={disabled} onClick={()=>input.current.click()}><Upload size={16}/>{hasFile?t[3]:t[1]}</button>
   {hasFile&&<button type="button" disabled={disabled} onClick={onRemove}><Trash2 size={16}/>{t[4]}</button>}
  </div>
 </div>;
}
