import {useEffect,useState} from 'react';
import {adminFetch} from '../lib/adminApi';
import {deviceLabel} from '../lib/uiText';
import './VisitorChart.css';
const copy={
 UZ:{title:'Tashriflar statistikasi',week:'Haftalik',month:'Oylik',year:'Yillik',total:'Jami tashriflar',loading:'Yuklanmoqda…',failed:'Statistikani yuklab bo‘lmadi.',weekRange:'Oxirgi 7 kun',monthRange:'Oxirgi 30 kun',yearRange:'Oxirgi 12 oy'},
 ENG:{title:'Visitor analytics',week:'Weekly',month:'Monthly',year:'Yearly',total:'Total visits',loading:'Loading…',failed:'Unable to load analytics.',weekRange:'Past 7 days',monthRange:'Past 30 days',yearRange:'Past 12 months'},
 RU:{title:'Статистика посещений',week:'За неделю',month:'За месяц',year:'За год',total:'Всего посещений',loading:'Загрузка…',failed:'Не удалось загрузить статистику.',weekRange:'Последние 7 дней',monthRange:'Последние 30 дней',yearRange:'Последние 12 месяцев'},
 JP:{title:'訪問統計',week:'週間',month:'月間',year:'年間',total:'合計訪問数',loading:'読み込み中…',failed:'統計を読み込めませんでした。',weekRange:'過去7日間',monthRange:'過去30日間',yearRange:'過去12か月'}
};
export default function VisitorChart({language}){
 const t=copy[language]||copy.ENG,locale={UZ:'uz',ENG:'en',RU:'ru',JP:'ja'}[language];
 const [period,setPeriod]=useState('week'),[rows,setRows]=useState([]),[busy,setBusy]=useState(false),[error,setError]=useState(false),[selected,setSelected]=useState(null);
 useEffect(()=>{let current=true;setBusy(true);setError(false);setSelected(null);
  adminFetch(window.API_BASE_URL+'/api/dashboard/stats/?period='+period).then(r=>r.json()).then(data=>{if(current)setRows(data.visitor_analytics||[]);}).catch(()=>{if(current)setError(true);}).finally(()=>{if(current)setBusy(false);});return()=>{current=false;};
 },[period]);
 const maximum=Math.max(1,...rows.map(r=>r.count));
 const date=(row,options)=>new Intl.DateTimeFormat(locale,{timeZone:'Asia/Tashkent',...options}).format(new Date(row.date+'T12:00:00+05:00'));
 return <div className="dashboard-analytics-box glass-panel visitor-chart"><div className="panel-header-with-action"><div><h3>{t.title}</h3><p className="muted">{t[period+'Range']}</p></div><select aria-label={t.title} value={period} onChange={e=>setPeriod(e.target.value)}>{['week','month','year'].map(p=><option key={p} value={p}>{t[p]}</option>)}</select></div>
 {error?<p role="alert">{t.failed}</p>:busy?<p role="status">{t.loading}</p>:<div className="visitor-chart-scroll"><div className={'visitor-chart-bars period-'+period}>{rows.map((row,i)=><div className={'visitor-chart-column'+(selected===i?' is-selected':'')} key={row.date}>
  <button className="visitor-chart-bar-area" aria-label={date(row,{dateStyle:'full'})+', '+t.total+': '+row.count} aria-describedby={'visit-tooltip-'+i} onClick={()=>setSelected(selected===i?null:i)}><span className="visitor-chart-fill" style={{height:Math.max(row.count?3:0,row.count/maximum*100)+'%'}}/></button>
  <span className="visitor-chart-label">{date(row,period==='week'?{weekday:'short'}:period==='year'?{month:'short'}:{day:'numeric'})}</span>
  <div className="visitor-chart-tooltip" id={'visit-tooltip-'+i} role="tooltip"><strong>{date(row,period==='year'?{month:'long',year:'numeric'}:{weekday:'long',day:'numeric',month:'long'})}</strong><div>{t.total}: <b>{row.count}</b></div>{['desktop','mobile','tablet',...(row.devices?.unknown?['unknown']:[])].map(type=><div key={type}>{deviceLabel(type,language)}: <b>{row.devices?.[type]||0}</b></div>)}</div>
 </div>)}</div></div>}</div>;
}

