import { readFile } from "../helpers.js";

export function getCategories(req, res) {
  const categories = readFile('./categories/categories.json');

  const preparedData = categories.map(category => ({
    id: category.id,
    name: category.name,
    pathById: category.pathById,
    pathByName: category.pathByName,
    hasChildren: category.hasChildren,
    children: category.children.map(child => ({
      id: child.id,
      name: child.name,
      pathById: child.pathById,
      pathByName: child.pathByName,
      hasChildren: child.hasChildren,
    }))
  }));

  return res.json(preparedData);
}