import express from "express";
import { getCategories } from "./api/get-categories.js";
import { getCategoriesByPath } from "./api/get-category-by-path.js";
import { searchCategories } from "./api/get-category.js";
import { isAuthenticated } from "./api/middlewares/token.js";
import { token } from "./token.js";

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

export { router };
