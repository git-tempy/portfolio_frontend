// Keep one order for this page visit, shared by the home and catalog views.
// A full reload starts a fresh order; filters and language changes keep it.
export function createProjectOrder(random = Math.random) {
  const ranks = new Map();
  let nextRank = 0;

  return function orderProjects(projects) {
    const unseen = [...new Set(projects.map(project => String(project.id)))]
      .filter(id => !ranks.has(id));
    for (let index = unseen.length - 1; index > 0; index -= 1) {
      const target = Math.floor(random() * (index + 1));
      [unseen[index], unseen[target]] = [unseen[target], unseen[index]];
    }
    unseen.forEach(id => ranks.set(id, nextRank++));
    return [...projects].sort((a, b) => ranks.get(String(a.id)) - ranks.get(String(b.id)));
  };
}

export const orderProjects = createProjectOrder();
