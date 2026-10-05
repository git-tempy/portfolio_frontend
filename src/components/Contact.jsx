import {textFor} from '../lib/uiText';
import { useState } from 'react';
import { Send, Mail, ArrowUpRight } from 'lucide-react';
import { locales } from '../locales';
export default function Contact({ language }) {
  const t=(locales[language]||locales.ENG).contact;
  const [busy,setBusy]=useState(false),[status,setStatus]=useState('');
  const ui=textFor(language);
  async function submit(e) {
    e.preventDefault(); const form=e.currentTarget;
    setBusy(true);setStatus('');
    try {
      const response=await fetch(window.API_BASE_URL+'/api/contact/',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(form))),signal:AbortSignal.timeout(15000)});
      if(!response.ok)throw new Error();
      setStatus('success');form.reset();
    } catch {setStatus('error');} finally {setBusy(false);}
  }
  return <section id="contact" className="section contact-section"><div className="container contact-layout"><div className="contact-copy"><span className="eyebrow">06 / {ui.talk}</span><h2>{t.title}<span className="accent">.</span></h2><p>{t.desc}</p></div><div className="contact-links"><h3>{ui.contacts}</h3>{[['EMAIL','fmuxtorov6@gmail.com','mailto:fmuxtorov6@gmail.com'],['TELEGRAM','@des_one','https://t.me/des_one'],['LINKEDIN','Feruzxon Muxtarov','https://linkedin.com/in/feruzxon-muxtarov']].map(([label,text,url])=><a key={label} href={url} target={label==='EMAIL'?undefined:'_blank'} rel="noreferrer"><span className="contact-icon" aria-hidden="true">{label==='EMAIL'?<Mail size={16}/>:label==='TELEGRAM'?<Send size={16}/>:<strong>in</strong>}</span><div><span className="eyebrow">{label==='EMAIL'?t.fields.email:label}</span><span>{text}</span></div><ArrowUpRight size={21}/></a>)}</div><form className="contact-form glass" onSubmit={submit}><div className="form-two">{['name','email','company','role'].map(field=><label key={field}>{t.fields[field]}{['name','email'].includes(field)?' *':''}<input name={field} type={field==='email'?'email':'text'} required={['name','email'].includes(field)} autoComplete={{name:'name',email:'email',company:'organization',role:'organization-title'}[field]} maxLength={field==='name'?120:254}/></label>)}</div><label>{t.fields.message} *<textarea name="message" rows={5} required maxLength={5000}/></label><div className="form-submit"><span className="muted">{ui.required}</span><button className="button button-primary" disabled={busy}>{busy?ui.sending:t.btnSend}<Send size={17}/></button></div>{status&&<p role="status" className={'form-status '+status}>{status==='success'?ui.sent:ui.failed}</p>}</form></div></section>;
}
