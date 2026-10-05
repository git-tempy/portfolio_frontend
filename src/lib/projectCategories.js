export const matchesCategory = (project, category) => !category || (project.category_id != null ? String(project.category_id) === String(category.id) : project.category === category.name);
