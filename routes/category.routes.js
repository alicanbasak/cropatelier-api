import upload from "../config/file-upload.js";
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { isLoggedIn } from "../middlewares/is-logged-in.js";
import express from "express";
import isAdmin from "../middlewares/is-admin.js";

// Initialize express router
const categoryRoutes = express.Router();

// Post request to create a new category
categoryRoutes.post("/", isLoggedIn, upload.single("file"), createCategory);
categoryRoutes.get("/", getCategories);
categoryRoutes.get("/:id", getCategory);
categoryRoutes.put(
  "/:id",
  isLoggedIn,
  isAdmin,
  upload.single("file"),
  updateCategory
);
categoryRoutes.delete("/:id", isLoggedIn, isAdmin, deleteCategory);

export default categoryRoutes;
