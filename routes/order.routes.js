import {
  createOrder,
  updateOrder,
  getOrder,
  getAllOrders,
} from "../controllers/order.controller.js";
import { isLoggedIn } from "../middlewares/is-logged-in.js";
import express from "express";

// Initialize express router
const orderRoutes = express.Router();

orderRoutes.get("/", isLoggedIn, getAllOrders);
orderRoutes.get("/:id", isLoggedIn, getOrder);
orderRoutes.post("/", isLoggedIn, createOrder);
orderRoutes.put("/update/:id", isLoggedIn, updateOrder);

export default orderRoutes;
