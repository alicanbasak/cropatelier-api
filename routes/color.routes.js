import {
  createColor,
  getAllColors,
  getColor,
  updateColor,
  deleteColor,
} from "../controllers/color.controller.js";
import { isLoggedIn } from "../middlewares/is-logged-in.js";
import express from "express";
import isAdmin from "../middlewares/is-admin.js";

// Initialize express router
const colorRoutes = express.Router();

// Post request to create a new color
colorRoutes.post("/", isLoggedIn, isAdmin, createColor);
colorRoutes.get("/", getAllColors);
colorRoutes.get("/:id", getColor);
colorRoutes.put("/:id", isLoggedIn, isAdmin, updateColor);
colorRoutes.delete("/:id", isLoggedIn, isAdmin, deleteColor);

export default colorRoutes;
