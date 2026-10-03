import {useState} from 'react';
const copy={
 UZ:{title:'Rezyumeni yuklab olish',intro:'Ma’lumotlarni yuboring — rezyume avtomatik yuklanadi.',name:'Ism',telegram:'Telegram (ixtiyoriy)',phone:'Telefon',purpose:'Yuklab olish maqsadi',submit:'Yuborish va yuklab olish',busy:'Yuklanmoqda…',done:'Rezyume yuklandi.',error:'Yuklab bo‘lmadi. Qayta urinib ko‘ring.'},
 ENG:{title:'Download resume',intro:'Submit your details to download the resume automatically.',name:'Name',telegram:'Telegram (optional)',phone:'Phone',purpose:'Reason for downloading',submit:'Submit and download',busy:'Downloading…',done:'Resume downloaded.',error:'Download failed. Please try again.'},
 RU:{title:'Скачать резюме',intro:'Отправьте данные — резюме скачается автоматически.',name:'Имя',telegram:'Telegram (необязательно)',phone:'Телефон',purpose:'Цель скачивания',submit:'Отправить и скачать',busy:'Загрузка…',done:'Резюме скачано.',error:'Не удалось скачать. Попробуйте ещё раз.'},
 JP:{title:'履歴書をダウンロード',intro:'情報を送信すると履歴書が自動でダウンロードされます。',name:'お名前',telegram:'Telegram（任意）',phone:'電話番号',purpose:'ダウンロードの目的',submit:'送信してダウンロード',busy:'ダウンロード中…',done:'履歴書をダウンロードしました。',error:'ダウンロードできませんでした。再度お試しください。'}
};
export default function ResumeDownloadForm({url,language}){
 const t=copy[language]||copy.ENG,[busy,setBusy]=useState(false),[status,setStatus]=useState('');
 const submit=async e=>{
  e.preventDefault();setBusy(true);setStatus('');
  try{
   const data=Object.fromEntries(new FormData(e.currentTarget)),file=await fetch(url);
   if(!file.ok)throw Error('File unavailable');
   const blob=await file.blob();
   const response=await fetch(window.API_BASE_URL+'/api/resume-downloads/',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
   if(!response.ok)throw Error('Submission failed');
   const link=document.createElement('a'),href=URL.createObjectURL(blob);link.href=href;link.download='Feruzxon-Muxtarov-Resume.pdf';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(href),60000);setStatus('done');
  }catch{setStatus('error');}finally{setBusy(false);}
 };
 return <form className="contact-form resume-request-form" onSubmit={submit} style={{width:'min(100%,520px)',maxHeight:'100%',overflowY:'auto',margin:'auto',padding:24}}><h2>{t.title}</h2><p>{t.intro}</p>{['name','telegram','phone'].map(field=><label key={field}>{t[field]}<input autoFocus={field==='name'} name={field} type={field==='email'?'email':field==='phone'?'tel':'text'} autoComplete={field==='phone'?'tel':field} required={field!=='telegram'} maxLength={field==='phone'?50:100} disabled={busy}/></label>)}<label>{t.purpose}<textarea name="purpose" rows={3} required maxLength={2000} disabled={busy}/></label><button className="button button-primary" disabled={busy||!url}>{busy?t.busy:t.submit}</button>{status&&<p role={status==='error'?'alert':'status'}>{t[status]}</p>}</form>;
}

