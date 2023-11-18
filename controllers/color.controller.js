import Color from "../models/Color.js";
import asyncHandler from "express-async-handler";

// @desc Create New Color
// @route POST /api/v1/colors
// @access Private/Admin

export const createColor = asyncHandler(async (req, res) => {
  const { name } = req.body;

  // Color exists
  if (await Color.findOne({ name })) {
    throw new Error("Color already exists");
  }

  // Create Color
  const color = await Color.create({
    name: name.toLowerCase(),
    user: req.userId,
  });

  // Send response
  return res.status(201).json({
    status: "success",
    message: "Color created successfully",
    data: color,
  });
});

// @desc Get All Colors
// @route GET /api/v1/colors
// @access Public

export const getAllColors = asyncHandler(async (req, res) => {
  const colors = await Color.find();
  // Send response
  return res.status(200).json({
    status: "success",
    message: "Colors fetched successfully",
    colors,
  });
});

// @desc Get Single Color
// @route GET /api/v1/colors/:id
// @access Public

export const getColor = asyncHandler(async (req, res) => {
  const color = await Color.findById(req.params.id);
  // Send response
  return res.status(200).json({
    status: "success",
    message: "Color fetched successfully",
    color,
  });
});

// @desc Update Color
// @route PUT /api/v1/colors/:id
// @access Private/Admin

export const updateColor = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const color = await Color.findByIdAndUpdate(
    req.params.id,
    {
      name: name.toLowerCase(),
      user: req.userId,
    },
    {
      new: true,
    }
  );

  // Send response
  return res.status(200).json({
    status: "success",
    message: "Color updated successfully",
    color,
  });
});

// @desc Delete Color
// @route DELETE /api/v1/colors/:id
// @access Private/Admin

export const deleteColor = asyncHandler(async (req, res) => {
  const color = await Color.findByIdAndDelete(req.params.id);

  // Send response
  return res.status(200).json({
    status: "success",
    message: "Color deleted successfully",
    color,
  });
});
