export const normalizeTag = value => String(value || '').trim().replace(/^#+/, '').toLocaleLowerCase();
export const projectTags = project => [project.main_hashtag, project.regular_hashtags].flatMap(value => String(value || '').split(/[\s,;]+/)).map(normalizeTag).filter(Boolean);
export const hasProjectTag = (project, tag) => projectTags(project).includes(normalizeTag(tag));
