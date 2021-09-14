const express = require("express");
const { getCategories } = require("./api/get-categories.js");
const { getCategoriesByPath } = require("./api/get-category-by-path.js");
const { searchCategories } = require("./api/get-category.js");
const { isAuthenticated } = require("./api/middlewares/token.js");
const { token } = require("./token.js");

const router = express.Router();

router.get("/", (req, res) => res.json({ message: "Hello World!" }));
router.get(
  "/categories/search-by-path/:browsePath",
  isAuthenticated,
  getCategoriesByPath
);
router.get("/categories/search/:idOrName", isAuthenticated, searchCategories);
router.get("/categories", isAuthenticated, getCategories);

router.get("/verify-token", (req, res) => {
  return res.json({ isValid: req.query.token === token });
});

module.exports = { router };
