import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { isLoggedIn } from "../middlewares/is-logged-in.js";
import express from "express";

// Initialize express router
const categoryRoutes = express.Router();

// Post request to create a new category
categoryRoutes.post("/", isLoggedIn, createCategory);
categoryRoutes.get("/", getCategories);
categoryRoutes.get("/:id", getCategory);
categoryRoutes.put("/:id", isLoggedIn, updateCategory);
categoryRoutes.delete("/:id", isLoggedIn, deleteCategory);

export default categoryRoutes;
