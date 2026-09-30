import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveLanguage } from './language.js';

test('maps device regional and script locales to available translations', () => {
  for (const [locale, expected] of [['uz-Latn-UZ','UZ'],['ru-RU','RU'],['en-US','ENG'],['ja-JP','JP']]) {
    assert.equal(resolveLanguage({deviceLanguages:[locale]}),expected);
  }
});
test('uses the first supported device language, otherwise English', () => {
  assert.equal(resolveLanguage({deviceLanguages:['de-DE','ru-RU','en']}),'RU');
  assert.equal(resolveLanguage({deviceLanguages:['fr-FR']}),'ENG');
  assert.equal(resolveLanguage(),'ENG');
});
test('fresh visits use the device language despite stale links or saved choices', () => {
  assert.equal(resolveLanguage({preference:'UZ',deviceLanguages:['ru']}),'RU');
  assert.equal(resolveLanguage({search:'?lang=UZ',preference:'UZ',deviceLanguages:['ja-JP']}),'JP');
  assert.equal(resolveLanguage({search:'?lang=invalid',preference:'invalid',deviceLanguages:['ru']}),'RU');
});
