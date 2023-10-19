import {
  createOrder,
  updateOrder,
  getAllOrders,
} from "../controllers/order.controller.js";
import { isLoggedIn } from "../middlewares/is-logged-in.js";
import express from "express";

// Initialize express router
const orderRoutes = express.Router();

// Post request to create a new order
orderRoutes.get("/", isLoggedIn, getAllOrders);
orderRoutes.post("/", isLoggedIn, createOrder);
orderRoutes.put("/:id", isLoggedIn, updateOrder);

export default orderRoutes;
