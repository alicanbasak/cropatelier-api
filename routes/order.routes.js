import { createOrder } from "../controllers/order.controller.js";
import { isLoggedIn } from "../middlewares/is-logged-in.js";
import express from "express";

// Initialize express router
const orderRoutes = express.Router();

// Post request to create a new order
orderRoutes.post("/", isLoggedIn, createOrder);

export default orderRoutes;
