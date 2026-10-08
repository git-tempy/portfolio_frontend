export function experienceAnimationType(job) {
 const role=[job.role_en,job.role_uz,job.role_ru,job.role_jp,job.role].filter(Boolean).join(' ');
 const company=[job.company_en,job.company_uz,job.company_ru,job.company_jp,job.company].filter(Boolean).join(' ');
 const description=[job.desc_en,job.desc_uz,job.desc_ru,job.desc_jp,job.desc].filter(Boolean).join(' ');
 if(/textbook|kitob|darsli[kg]|учебник|教科書|日本語教材/i.test(role+' '+description)) return 'textbook';
 return /freelance|frilans|фриланс|フリーランス/i.test(role+' '+company)?'freelance':'university';
}

