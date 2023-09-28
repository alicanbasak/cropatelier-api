import Product from "../models/Product.js";
import asyncHandler from "express-async-handler";
import { applyFiltersAndPagination } from "../utils/filter-pagination.js";

// @desc Create New Product
// @route POST /api/v1/products
// @access Private/Admin

export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, category, sizes, colors, price, totalQty } =
    req.body;
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
  const { query, pagination, total } = await applyFiltersAndPagination(
    Product.find(),
    req
  );

  const products = await query;

  return res.json({
    status: "success",
    message: "Products fetched successfully",
    total,
    pagination,
    result: products.length,
    products,
  });
});
