import Category from "../models/Category.js";
import asyncHandler from "express-async-handler";

// @desc Create New Category
// @route POST /api/v1/categories
// @access Private/Admin

export const createCategory = asyncHandler(async (req, res) => {
  try {
    // Get data from request body
    const { name, parent, image } = req.body;

    // Check if category already exists
    const category = new Category({
      name,
      user: req.userId,
      image,
    });

    // Check if parent category exists
    if (parent) {
      category.parent = parent;
    }

    // Save category
    const savedCategory = await category.save();

    // Send response
    res.status(201).json({
      status: 201,
      message: "Category created successfully",
      category: savedCategory,
    });
  } catch (error) {
    // Send error response
    res.status(500).json({ error: "Category not created" });
    console.log(error);
  }
});

// @desc Get All Categories
// @route GET /api/v1/categories
// @access Public

export const getCategories = asyncHandler(async (req, res) => {
  try {
    // Get all categories
    const categories = await Category.find();
    // Send response
    res.json({
      status: 200,
      message: "Categories fetched successfully",
      categories,
    });
  } catch (err) {
    res.status(500).json({ error: "Categories not fetced" });
  }
});

// @desc Get Single Category
// @route GET /api/v1/categories/:id
// @access Public

export const getCategory = asyncHandler(async (req, res) => {
  try {
    // Get category by id
    const category = await Category.findById(req.params.id);

    // Check if category exists
    if (!category) {
      res.status(404).json({ error: "Category not found" });
    }

    // Send response
    res.json({
      status: 200,
      message: "Category fetched successfully",
      category,
    });
  } catch (err) {
    res.status(500).json({ error: "Category not fetced" });
  }
});

// @desc Update Category
// @route PUT /api/v1/categories/:id
// @access Private/Admin

export const updateCategory = asyncHandler(async (req, res) => {
  try {
    // Get category by id
    const category = await Category.findById(req.params.id);

    // Check if category exists
    if (!category) {
      res.status(404).json({ error: "Category not found" });
    }

    // Get data from request body
    const { name, parent, image } = req.body;

    // Update category
    category.name = name || category.name;
    category.parent = parent || category.parent;
    category.image = image || category.image;

    // Save category
    const updatedCategory = await category.save();

    // Send response
    res.json({
      status: 200,
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (err) {
    res.status(500).json({ error: "Category not updated" });
  }
});

// @desc Delete Category
// @route DELETE /api/v1/categories/:id
// @access Private/Admin

export const deleteCategory = asyncHandler(async (req, res) => {
  try {
    // Get category by id
    const category = await Category.findById(req.params.id);

    // Check if category exists
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }

    // Check if category has subcategories
    if (category.parent && category.parent) {
      res.status(400).json({ error: "Category has subcategories" });
      return;
    }

    // Check if category has products
    if (category.products && category.products.length > 0) {
      res.status(400).json({ error: "Category has products" });
      return;
    }

    // Delete category
    await category.deleteOne();

    // Send response
    res.json({
      status: 200,
      message: "Category deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Category not deleted" });
  }
});