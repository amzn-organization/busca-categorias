import express from "express";
import { getCategories } from "./api/get-categories.js";
import { getCategoriesByPath } from "./api/get-category-by-path.js";
import { searchCategories } from "./api/get-category.js";
import { token } from "./token.js";

const router = express.Router();

router.use("/", (req, res, next) => {
  if (!req.query.token) {
    return res.status(401).json();
  }

  if (req.query.token !== token) {
    return res.status(401).json();
  }

  next();
});

router.get("/", (req, res) => res.json({ message: "Hello World!" }));
router.get("/categories/search-by-path/:browsePath", getCategoriesByPath);
router.get("/categories/search/:idOrName", searchCategories);
router.get("/categories", getCategories);

router.get("/verify-token", (req, res) => {
  return res.json({ isValid: req.query.token === token });
});

export { router };
