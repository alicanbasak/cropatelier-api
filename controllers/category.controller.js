import Category from "../models/Category.js";
import asyncHandler from "express-async-handler";

// @desc Create New Category
// @route POST /api/v1/categories
// @access Private/Admin

export const createCategory = asyncHandler(async (req, res) => {
  try {
    // Get data from request body
    const { name, parent } = req.body;

    // Check if category already exists
    const category = new Category({
      name: name?.toLowerCase(),
      user: req.userId,
      image: req.file?.path,
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
      data: savedCategory,
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
      data: category,
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
      return;
    }

    // Get data from request body
    const { name, parent } = req.body;

    // Update category
    category.name = name || category.name;
    category.parent = parent || category.parent;

    // Image update
    if (req.file) {
      const file = req.file;
      const convertedImage = file.path;
      category.image = convertedImage;
    }

    // Save category
    const updatedCategory = await category.save();

    // Send response
    res.json({
      status: 200,
      message: "Category updated successfully",
      data: updatedCategory,
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
    if (category.parent) {
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
