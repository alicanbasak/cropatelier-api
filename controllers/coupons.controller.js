import Coupon from "../models/Coupon.js";
import asyncHandler from "express-async-handler";
// @desc Create new coupon
// @route POST /api/coupons
// @access Private/Admin

export const createCoupon = asyncHandler(async (req, res) => {
  // Get coupon details from request body
  const { code, discount, startDate, endDate } = req.body;

  // Create new coupon
  const coupon = await Coupon.create({
    code,
    discount,
    startDate,
    endDate,
    user: req.userId,
  });

  // Check if coupon is created successfully
  if (!coupon) {
    throw new Error("Coupon not created");
  }

  // If coupon is created successfully, return a success message
  res.json({
    success: true,
    message: "Coupon created successfully",
    data: coupon,
  });
});
