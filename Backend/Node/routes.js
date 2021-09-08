import express from "express";
import { getCategories } from "./api/get-categories.js";
import { getCategoriesByPath } from "./api/get-categoriy-by-path.js";
import { searchCategories } from "./api/get-category.js";

const router = express.Router();

router.get("/", (req, res) => res.json({ message: "Hello World!" }));
router.get("/categories/search-by-path/:browsePath", getCategoriesByPath);
router.get("/categories/search/:idOrName", searchCategories);
router.get("/categories", getCategories);

export { router };
