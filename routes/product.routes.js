import {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { isLoggedIn } from "../middlewares/is-logged-in.js";
import express from "express";

// Initialize express router
const productRoutes = express.Router();

// Post request to create a new product
productRoutes.post("/", isLoggedIn, createProduct);
productRoutes.get("/", isLoggedIn, getAllProducts);
productRoutes.get("/:id", isLoggedIn, getProduct);
productRoutes.put("/:id", isLoggedIn, updateProduct);
productRoutes.delete("/:id", isLoggedIn, deleteProduct);

export default productRoutes;
