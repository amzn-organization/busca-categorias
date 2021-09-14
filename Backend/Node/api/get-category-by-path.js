const { readFile } = require("../helpers.js");

function getCategoriesByPath(req, res) {
  let browsePath = req.params.browsePath;
  const categories = readFile(
    "./categories/categories-root-with-children.json"
  );

  const categoriesFiltered = categories.filter(
    (category) => category.pathById === browsePath
  );

  return res.json(categoriesFiltered);
}

module.exports = {
  getCategoriesByPath,
};
