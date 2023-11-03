import Slider from "../models/slider.model.js";
import asyncHandler from "express-async-handler";

// Create and Save a new Slider
export const create = asyncHandler(async (req, res) => {
  const convertedImage = req.file.path;
  // Validate request
  const { title, status } = req.body;

  if (!title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Slider exisrt already ?
  const sliderExists = await Slider.findOne({ title });

  if (sliderExists) {
    throw new Error("Slider already exists");
  }

  // Create a Slider
  const slider = await Slider.create({
    title,
    image: convertedImage,
    status,
  });

  // Send response
  return res.status(201).json({
    status: "success",
    message: "Slider created successfully",
    data: slider,
  });
});
