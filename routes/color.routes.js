import {
  createColor,
  getAllColors,
  getColor,
  updateColor,
  deleteColor,
} from "../controllers/color.controller.js";
import { isLoggedIn } from "../middlewares/is-logged-in.js";
import express from "express";

// Initialize express router
const colorRoutes = express.Router();

// Post request to create a new color
colorRoutes.post("/", isLoggedIn, createColor);
colorRoutes.get("/", getAllColors);
colorRoutes.get("/:id", getColor);
colorRoutes.put("/:id", isLoggedIn, updateColor);
colorRoutes.delete("/:id", isLoggedIn, deleteColor);

export default colorRoutes;