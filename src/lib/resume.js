export const resumeField = language => 'resume_pdf_' + ({UZ:'uz',RU:'ru',ENG:'en',JP:'jp'}[language]||'en');
export const resumeUrl = (about,language) => about?.[resumeField(language)] || about?.resume_pdf || undefined;
