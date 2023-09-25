import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../controllers/usersController.js";
import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

// Initialize express router
const userRoutes = express.Router();

// Post request to register a new user
userRoutes.post("/register", registerUser);

// Post request to login a user
userRoutes.post("/login", loginUser);

// Get request to get user profile
userRoutes.get("/profile", isLoggedIn, getUserProfile);

export default userRoutes;
