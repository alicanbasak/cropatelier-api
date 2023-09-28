import Product from "../models/Product.js";
import asyncHandler from "express-async-handler";

// @desc Create New Product
// @route POST /api/v1/products
// @access Private/Admin

export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    category,
    sizes,
    colors,
    brand,
    user,
    price,
    totalQty,
  } = req.body;
  console.log(req.headers.authorization);
  console.log(req.body);
  console.log(req.user);
  // Product exists
  const productExists = await Product.findOne({ name });
  if (productExists) {
    throw new Error("Product already exists");
  }

  // Create Product
  const product = await Product.create({
    name,
    description,
    category,
    brand,
    sizes,
    colors,
    user: req.userId,
    price,
    totalQty,
  });

  //Push Product to Category
  // Send response
  return res.status(201).json({
    status: "success",
    message: "Product created successfully",
    product,
  });
});

// @desc Get All Products
// @route GET /api/v1/products
// @access Public

export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  return res.json({
    status: "success",
    products,
  });
});
