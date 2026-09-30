const languageCodes = { en: 'ENG', eng: 'ENG', uz: 'UZ', ru: 'RU', ja: 'JP', jp: 'JP' };

export function supportedLanguage(value) {
  const code = typeof value === 'string' ? value.toLowerCase().split(/[-_]/)[0] : '';
  return Object.hasOwn(languageCodes, code) ? languageCodes[code] : undefined;
}

export function resolveLanguage({ deviceLanguages = [] } = {}) {
  return deviceLanguages.map(supportedLanguage).find(Boolean) || 'ENG';
}
