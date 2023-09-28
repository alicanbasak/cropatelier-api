import {
  createProduct,
  getAllProducts,
} from "../controllers/product.controller.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import express from "express";

// Initialize express router
const productRoutes = express.Router();

// Post request to create a new product
productRoutes.post("/", isLoggedIn, createProduct);
productRoutes.get("/", isLoggedIn, getAllProducts);

export default productRoutes;
