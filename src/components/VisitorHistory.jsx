import {useEffect,useState} from 'react';
import {adminFetch} from '../lib/adminApi';
import {deviceLabel} from '../lib/uiText';

const copy={
 UZ:{title:'Tashriflar tarixi',device:'Qurilma',address:'Manzil',date:'Tashrif vaqti',all:'Bu qurilmaning barcha tashriflari',back:'Barcha qurilmalar',more:'Yana ko‘rsatish',unknown:'Aniqlanmagan',loading:'Yuklanmoqda…',empty:'Hali tashriflar yo‘q.',failed:'Yuklashda xatolik. Qayta urinib ko‘ring.',note:'Manzil IP asosida taxminiy aniqlanadi. VPN yoki mobil operator boshqa hududni ko‘rsatishi mumkin.'},
 ENG:{title:'Visit history',device:'Device',address:'Location',date:'Visit time',all:'All visits from this device',back:'All devices',more:'Show more',unknown:'Unknown',loading:'Loading…',empty:'No visits yet.',failed:'Unable to load visits. Please try again.',note:'Location is estimated from IP. A VPN or mobile carrier may show a different region.'},
 RU:{title:'История посещений',device:'Устройство',address:'Местоположение',date:'Время посещения',all:'Все посещения этого устройства',back:'Все устройства',more:'Показать ещё',unknown:'Не определено',loading:'Загрузка…',empty:'Посещений пока нет.',failed:'Не удалось загрузить посещения. Попробуйте ещё раз.',note:'Местоположение определяется приблизительно по IP. VPN или мобильный оператор могут показывать другой регион.'},
 JP:{title:'訪問履歴',device:'デバイス',address:'所在地',date:'訪問日時',all:'このデバイスの全訪問履歴',back:'すべてのデバイス',more:'さらに表示',unknown:'不明',loading:'読み込み中…',empty:'訪問履歴はまだありません。',failed:'履歴を読み込めませんでした。再度お試しください。',note:'所在地はIPから推定されます。VPNや携帯通信会社により別の地域が表示される場合があります。'}
};
const locale={UZ:'uz',ENG:'en',RU:'ru',JP:'ja'};
function location(row,language,t){
 let country=row.country_code;
 try{if(country)country=new Intl.DisplayNames([locale[language]],{type:'region'}).of(country);}catch{/* Keep country code if unsupported. */}
 const regions={TK:'Toshkent',TO:'Toshkent viloyati',AN:'Andijon',BU:'Buxoro',FA:'Farg‘ona',JI:'Jizzax',NG:'Namangan',NW:'Navoiy',QA:'Qashqadaryo',QR:'Qoraqalpog‘iston',SA:'Samarqand',SI:'Sirdaryo',SU:'Surxondaryo',XO:'Xorazm'};
 const uzCountries={UZ:'O‘zbekiston',US:'AQSH',RU:'Rossiya',JP:'Yaponiya',TR:'Turkiya',KZ:'Qozog‘iston',KG:'Qirg‘iziston',TJ:'Tojikiston',KR:'Janubiy Koreya',CN:'Xitoy',GB:'Buyuk Britaniya',DE:'Germaniya',FR:'Fransiya',IN:'Hindiston',AE:'Birlashgan Arab Amirliklari'};
 if(language==='UZ'&&uzCountries[row.country_code])country=uzCountries[row.country_code];
 const tashkent={UZ:'Toshkent',ENG:'Tashkent',RU:'Ташкент',JP:'タシケント'}[language];
 const region=row.country_code==='UZ'&&row.region==='TK'?tashkent:row.country_code==='UZ'&&regions[row.region]?regions[row.region]:row.region;
 const city=/^(Tashkent|Toshkent)$/i.test(row.city||'')?tashkent:row.city;
 return [country,region,city].filter(Boolean).filter((v,i,a)=>a.indexOf(v)===i).join(', ')||t.unknown;
}
export default function VisitorHistory({language}){
 const t=copy[language]||copy.ENG;
 const [filter,setFilter]=useState(null),[page,setPage]=useState(0),[rows,setRows]=useState([]),[more,setMore]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(false);
 useEffect(()=>{
  let current=true;setBusy(true);setError(false);
  const query=new URLSearchParams({visits_page:String(page)});if(filter)query.set('visits_device',filter);
  adminFetch(window.API_BASE_URL+'/api/dashboard/stats/?'+query).then(r=>r.json()).then(data=>{if(current){setRows(old=>page?[...old,...data.visitor_entries]:data.visitor_entries||[]);setMore(!!data.visitor_entries_more);}}).catch(()=>{if(current)setError(true);}).finally(()=>{if(current)setBusy(false);});
  return()=>{current=false;};
 },[filter,page]);
 const select=id=>{setRows([]);setPage(0);setFilter(id);};
 return <div className="dashboard-devices-box glass-panel"><h3>{t.title}</h3>{filter&&<button className="text-button" onClick={()=>select(null)}>{t.back}</button>}
 <div className="device-table-scroll"><table className="device-table"><thead><tr><th>ID</th><th>{t.device}</th><th>{t.address}</th><th>IP</th><th>{t.date}</th><th>{t.all}</th></tr></thead><tbody>{rows.map(row=><tr key={row.id}><td><code>{({desktop:'D',mobile:'M',tablet:'P'}[row.device_type]||'U')+String(row.short_id).padStart(4,'0')}</code></td><td>{deviceLabel(row.device_type,language)}</td><td>{location(row,language,t)}</td><td>{row.ip_address||'—'}</td><td>{new Date(row.created_at).toLocaleString(locale[language])}</td><td><button className="text-button" onClick={()=>select(row.device_id)} disabled={filter===row.device_id}>{t.all}</button></td></tr>)}</tbody></table></div>
 {error&&<p role="alert">{t.failed}</p>}{busy&&<p role="status">{t.loading}</p>}{!busy&&!error&&!rows.length&&<p>{t.empty}</p>}{more&&<button className="text-button" disabled={busy} onClick={()=>setPage(p=>p+1)}>{t.more}</button>}<p className="muted">{t.note}</p></div>;
}

