import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserShippingAddress,
} from "../controllers/user.controller.js";
import express from "express";
import { isLoggedIn } from "../middlewares/is-logged-in.js";

// Initialize express router
const userRoutes = express.Router();

// Post request to register a new user
userRoutes.post("/register", registerUser);

// Post request to login a user
userRoutes.post("/login", loginUser);

// Get request to get user profile
userRoutes.get("/profile", isLoggedIn, getUserProfile);

// Put request to update user shipping address
userRoutes.put("/update/shipping", isLoggedIn, updateUserShippingAddress);

export default userRoutes;
