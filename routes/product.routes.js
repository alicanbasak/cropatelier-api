import {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { isLoggedIn } from "../middlewares/is-logged-in.js";
import express from "express";
import upload from "../config/file-upload.js";
import isAdmin from "../middlewares/is-admin.js";

// Initialize express router
const productRoutes = express.Router();

// Post request to create a new product
productRoutes.post(
  "/",
  upload.array("files"),
  isLoggedIn,
  isAdmin,
  createProduct
);
productRoutes.get("/", getAllProducts);
productRoutes.get("/:id", getProduct);
productRoutes.put(
  "/:id",
  isLoggedIn,
  isAdmin,
  upload.array("files"),
  updateProduct
);
productRoutes.delete("/:id", isLoggedIn, isAdmin, deleteProduct);

export default productRoutes;
