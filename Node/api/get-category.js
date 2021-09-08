import { readFile, replaceDiacritics } from "../helpers.js";

export function searchCategories(req, res) {
  const id = req.params.idOrName;
  let isID = false;

  if (id.match(/^[0-9]+$/)) {
    isID = true;
  }

  if (!id) {
    return res.status(400).json({
      message: "Invalid category ID (browseNodeId)",
    });
  }

  const categories = readFile(
    "./categories/categories-root-with-children.json"
  );

  if (isID) {
    const category = categories.find((c) => String(c.id) === id);
    if (!category) {
      return res.status(404).json({
        message: `Category with browseNodeId ${id} not found`,
      });
    }

    return res.json(category);
  }

  const regex = new RegExp(replaceDiacritics(id).toLowerCase());
  const categoriesFiltered = categories.filter((c) =>
    replaceDiacritics(c.name).toLowerCase().match(regex)
  );

  return res.json(categoriesFiltered);
}
