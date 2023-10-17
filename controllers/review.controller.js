import Review from "../models/Review.js";
import Product from "../models/Product.js";
import asyncHandler from "express-async-handler";

// @desc Create New Review
// @route POST /api/v1/reviews
// @access Private

export const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  // Find the product
  const { productID } = req.params;
  const productExists = await Product.findById(productID).populate("reviews");

  // Check if product exists
  if (!productExists) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Check if user already reviewed the product
  const alreadyReviewed = await Review.findOne({
    user: req.userId,
    product: productID,
  });

  if (alreadyReviewed) {
    res.status(400);
    throw new Error("Product already reviewed");
  }

  // Check if user already reviewed the product
  const review = await Review.create({
    rating,
    comment,
    product: productExists?._id,
    user: req.userId,
  });

  // Add review to product
  productExists.reviews.push(review?._id);
  // Update product rating
  await productExists.save();

  // Send response
  res.status(201).json({
    success: true,
    data: review,
  });
});
