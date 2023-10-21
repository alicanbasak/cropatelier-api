import {
  createCoupon,
  getCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
} from "../controllers/coupons.controller.js";
import { isLoggedIn } from "../middlewares/is-logged-in.js";
import express from "express";

// Initialize express router
const couponRoutes = express.Router();

// Post request to create a new coupon
couponRoutes.post("/", isLoggedIn, isAdmin, createCoupon);
couponRoutes.get("/", isLoggedIn, getCoupons);
couponRoutes.get("/:id", isLoggedIn, getCoupon);
couponRoutes.put("/:id", isLoggedIn, isAdmin, updateCoupon);
couponRoutes.delete("/:id", isLoggedIn, isAdmin, deleteCoupon);

export default couponRoutes;
