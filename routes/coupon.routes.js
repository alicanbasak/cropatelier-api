import { createCoupon } from "../controllers/coupons.controller.js";
import { isLoggedIn } from "../middlewares/is-logged-in.js";
import express from "express";

// Initialize express router
const couponRoutes = express.Router();

// Post request to create a new coupon
couponRoutes.post("/", isLoggedIn, createCoupon);

export default couponRoutes;
