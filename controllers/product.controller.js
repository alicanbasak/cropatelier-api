import Product from "../models/Product.js";
import asyncHandler from "express-async-handler";
import { applyFiltersAndPagination } from "../utils/filter-pagination.js";
import Category from "../models/Category.js";

// @desc Create New Product
// @route POST /api/v1/products
// @access Private/Admin

export const createProduct = asyncHandler(async (req, res) => {
  console.log(req.files);

  const convertedImages = req.files.map((file) => file.path);

  const { name, description, category, sizes, colors, price, totalQty } =
    req.body;
  // Product exists
  const productExists = await Product.findOne({ name });
  // Check if product exists
  if (productExists) {
    throw new Error("Product already exists");
  }
  // Find the category
  const categoryFound = await Category.findOne({ name: category });
  if (!categoryFound) {
    throw new Error("Category not found");
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
    images: convertedImages,
  });
  //Push Product to Category
  categoryFound.products.push(product._id);
  // Save category
  await categoryFound.save();
  // Send response
  return res.status(201).json({
    status: "success",
    message: "Product created successfully",
    data: product,
  });
});

// @desc Get All Products
// @route GET /api/v1/products
// @access Public

export const getAllProducts = asyncHandler(async (req, res) => {
  // Apply filters and pagination
  const { query, pagination, total } = await applyFiltersAndPagination(
    Product.find().populate("reviews"),
    req
  );

  // Execute query
  const products = await query;

  // Send response
  return res.json({
    status: 200,
    message: "Products fetched successfully",
    total,
    pagination,
    result: products.length,
    data: products,
  });
});

// @desc Get Single Product
// @route GET /api/v1/products/:id
// @access Private

export const getProduct = asyncHandler(async (req, res) => {
  // Find product
  const product = await Product.findById(req.params.id).populate("reviews");

  // Check if product exists
  if (!product) {
    throw new Error("Product not found");
  }

  // Send response
  return res.json({
    status: 200,
    message: "Product fetched successfully",
    data: product,
  });
});

// @desc Update Product
// @route PUT /api/v1/products/:id
// @access Private/Admin

export const updateProduct = asyncHandler(async (req, res) => {
  // Find product
  const { name, description, category, sizes, colors, price, totalQty } =
    req.body;

  // image update
  const convertedImages = req.files.map((file) => file.path);

  // Check if product exists
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      category,
      sizes,
      colors,
      price,
      totalQty,
      images: convertedImages,
    },
    {
      // Return updated product
      new: true,
    }
  );

  // Send response
  return res.json({
    status: 200,
    message: "Product updated successfully",
    data: product,
  });
});

// @desc Delete Product
// @route DELETE /api/v1/products/:id
// @access Private/Admin

export const deleteProduct = asyncHandler(async (req, res) => {
  // Find product
  const product = await Product.findByIdAndDelete(req.params.id);

  // Delete product from category
  const category = await Category.findOne({ name: product.category });
  category.products.pull(product._id);
  await category.save();

  // Check if product exists
  return res.json({
    status: 200,
    message: "Product deleted successfully",
    data: product,
  });
});
