import test from 'node:test';
import assert from 'node:assert/strict';
import {resumeUrl,resumeField} from '../src/lib/resume.js';
test('each selected language routes to its own CV',()=>{
 const about={resume_pdf:'legacy.pdf',resume_pdf_uz:'uz.pdf',resume_pdf_ru:'ru.pdf',resume_pdf_en:'en.pdf',resume_pdf_jp:'jp.pdf'};
 for(const [language,code] of [['UZ','uz'],['RU','ru'],['ENG','en'],['JP','jp']]) {
  assert.equal(resumeField(language),'resume_pdf_'+code);
  assert.equal(resumeUrl(about,language),code+'.pdf');
 }
});
test('missing language file falls back to legacy only, never a different language',()=>{
 assert.equal(resumeUrl({resume_pdf:'legacy.pdf',resume_pdf_ru:'ru.pdf'},'UZ'),'legacy.pdf');
 assert.equal(resumeUrl({resume_pdf_ru:'ru.pdf'},'JP'),undefined);
});
