export const projectCoverImages=project=>[...new Set([project.cover_image,...(project.covers||[]).map(item=>item.image)].filter(Boolean))];
