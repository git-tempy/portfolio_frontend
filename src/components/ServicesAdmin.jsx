import {useEffect,useState} from 'react';
import {adminFetch} from '../lib/adminApi';
import {Plus, Pencil, Trash2} from 'lucide-react';
import './ServicesAdmin.css';
const languages=['uz','en','ru','jp'];
export default function ServicesAdmin({language}){
 const [items,setItems]=useState([]),[form,setForm]=useState(null),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const t=({UZ:{title:'Xizmatlar',add:'Xizmat qo‘shish',edit:'Tahrirlash',remove:'O‘chirish',save:'Saqlash',cancel:'Bekor qilish'},ENG:{title:'Services',add:'Add service',edit:'Edit',remove:'Delete',save:'Save',cancel:'Cancel'},RU:{title:'Услуги',add:'Добавить услугу',edit:'Изменить',remove:'Удалить',save:'Сохранить',cancel:'Отмена'},JP:{title:'サービス',add:'サービスを追加',edit:'編集',remove:'削除',save:'保存',cancel:'キャンセル'}})[language];
 const load=()=>adminFetch(window.API_BASE_URL+'/api/skills/').then(r=>r.json()).then(a=>setItems(a.filter(s=>s.type==='Service')));
 useEffect(()=>{load().catch(e=>setError(e.message));},[]);
 const save=async e=>{e.preventDefault();setBusy(true);setError('');try{const r=await adminFetch(window.API_BASE_URL+'/api/skills/'+(form.id?form.id+'/':''),{method:form.id?'PATCH':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,name:form.name_uz,type:'Service',level:null})});if(!r.ok)throw Error(await r.text());await load();setForm(null);}catch(e){setError(e.message);}finally{setBusy(false);}};
 return <section className="services-admin" aria-labelledby="services-admin-title">
  <header className="panel-toolbar-header services-admin-header">
   <h3 id="services-admin-title">{t.title}</h3>
   <button type="button" className="add-item-btn" onClick={()=>setForm(Object.fromEntries(languages.map(l=>['name_'+l,''])))}><Plus size={18}/>{t.add}</button>
  </header>
  {error&&<p role="alert">{error}</p>}
  {form&&<form className="services-admin-form" onSubmit={save}>
   <div className="services-admin-fields">{languages.map(l=><label key={l}>{l.toUpperCase()}<input required value={form['name_'+l]||''} onChange={e=>setForm({...form,['name_'+l]:e.target.value})}/></label>)}</div>
   <div className="services-admin-form-actions"><button className="add-item-btn" disabled={busy}>{t.save}</button><button type="button" className="services-admin-cancel" onClick={()=>setForm(null)}>{t.cancel}</button></div>
  </form>}
  <ul className="services-admin-list">{items.map(s=><li key={s.id}>
   <span className="services-admin-name">{s['name_'+({UZ:'uz',ENG:'en',RU:'ru',JP:'jp'})[language]]||s.name}</span>
   <div className="services-admin-actions">
    <button type="button" className="action-icon-btn edit-btn" title={t.edit} aria-label={t.edit} onClick={()=>setForm(s)}><Pencil size={16}/></button>
    <button type="button" className="action-icon-btn delete-btn" title={t.remove} aria-label={t.remove} onClick={async()=>{try{const r=await adminFetch(window.API_BASE_URL+'/api/skills/'+s.id+'/',{method:'DELETE'});if(!r.ok)throw Error(await r.text());await load();}catch(e){setError(e.message);}}}><Trash2 size={16}/></button>
   </div>
  </li>)}</ul>
 </section>;
}

