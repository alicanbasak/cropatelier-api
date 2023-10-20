import Coupon from "../models/Coupon.js";
import asyncHandler from "express-async-handler";
// @desc Create new coupon
// @route POST /api/coupons
// @access Private/Admin

export const createCoupon = asyncHandler(async (req, res) => {
  // Get coupon details from request body
  const { code, discount, startDate, endDate } = req.body;

  // Check if coupon already exists
  const couponExists = await Coupon.findOne({ code });

  // If coupon already exists, throw an error
  if (couponExists) {
    throw new Error("Coupon already exists");
  }

  // Check if coupon discount is a number
  if (isNaN(discount)) {
    throw new Error("Coupon discount must be a number");
  }

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

// @desc Get all coupons
// @route GET /api/coupons
// @access Private/Admin

export const getCoupons = asyncHandler(async (req, res) => {
  // Get all coupons
  const coupons = await Coupon.find();

  // Check if coupons are found
  if (!coupons) {
    throw new Error("Coupons not found");
  }

  // If coupons are found, return a success message
  res.json({
    success: true,
    message: "Coupons found successfully",
    data: coupons,
  });
});

// @desc Get coupon by id
// @route GET /api/coupons/:id
// @access Private/Admin

export const getCoupon = asyncHandler(async (req, res) => {
  // Get coupon by id
  const coupon = await Coupon.findById(req.params.id);

  // Check if coupon is found
  if (!coupon) {
    throw new Error("Coupon not found");
  }

  // If coupon is found, return a success message
  res.json({
    success: true,
    message: "Coupon found successfully",
    data: coupon,
  });
});

// @desc Update coupon
// @route PUT /api/coupons/:id
// @access Private/Admin

export const updateCoupon = asyncHandler(async (req, res) => {
  const { code, discount, startDate, endDate } = req.body;
  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    {
      code,
      discount,
      startDate,
      endDate,
      user: req.userId,
    },
    {
      new: true,
    }
  );

  // Check if coupon is updated
  if (!coupon) {
    throw new Error("Coupon not updated");
  }

  // If coupon is updated, return a success message
  res.json({
    success: true,
    message: "Coupon updated successfully",
    data: coupon,
  });
});

// @desc Delete coupon
// @route DELETE /api/coupons/:id
// @access Private/Admin

export const deleteCoupon = asyncHandler(async (req, res) => {
  // Get coupon by id
  const coupon = await Coupon.findByIdAndRemove(req.params.id);

  // Check if coupon is deleted
  if (!coupon) {
    throw new Error("Coupon not deleted");
  }

  // Return a success message
  res.json({
    success: true,
    message: "Coupon deleted successfully",
    data: coupon,
  });
});
