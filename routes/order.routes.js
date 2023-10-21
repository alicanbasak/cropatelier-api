import {
  createOrder,
  updateOrder,
  getOrder,
  getAllOrders,
  getOrderStats,
} from "../controllers/order.controller.js";
import isAdmin from "../middlewares/is-admin.js";
import { isLoggedIn } from "../middlewares/is-logged-in.js";
import express from "express";

// Initialize express router
const orderRoutes = express.Router();

orderRoutes.get("/", isLoggedIn, isAdmin, getAllOrders);
orderRoutes.get("/:id", isLoggedIn, getOrder);
orderRoutes.post("/", isLoggedIn, createOrder);
orderRoutes.put("/update/:id", isLoggedIn, isAdmin, updateOrder);
orderRoutes.get("/sales/stats", isLoggedIn, isAdmin, getOrderStats);

export default orderRoutes;
