import test from 'node:test';
import assert from 'node:assert/strict';
import {experienceAnimationType} from '../src/lib/experienceAnimation.js';
test('book animation survives renamed designer/coordinator role in all locales',()=>{
 for(const [key,value] of Object.entries({desc_en:'Japanese-language textbook',desc_uz:'Yapon tili darsligi',desc_ru:'Работа над учебником',desc_jp:'日本語教材を制作しています'})) {
  assert.equal(experienceAnimationType({role_en:'Designer and Coordinator',[key]:value}),'textbook');
 }
 assert.equal(experienceAnimationType({role_en:'Textbook Designer'}),'textbook');
});
test('university and freelance remain their original built-in animations',()=>{
 assert.equal(experienceAnimationType({role_en:'Graphic Designer',company_en:'Japan Digital University',desc_en:'Social posts, websites and event brochures.'}),'university');
 assert.equal(experienceAnimationType({role_uz:'Frilans dizayner',desc_en:'Branding and presentations'}),'freelance');
});
