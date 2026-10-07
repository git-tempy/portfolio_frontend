const identity=src=>{try{return new URL(src,globalThis.location?.origin||'https://example.invalid').pathname;}catch{return src;}};
export function projectCoverItems(project){const covers=project.covers||[];if(!project.cover_image||covers.some(item=>identity(item.image)===identity(project.cover_image)))return covers;return [{id:0,image:project.cover_image},...covers];}
export const projectCoverImages=project=>[...new Set(projectCoverItems(project).map(item=>item.image).filter(Boolean))];
