import { createReview } from "../controllers/review.controller.js";
import { isLoggedIn } from "../middlewares/is-logged-in.js";
import express from "express";

// Initialize express router
const reviewRoutes = express.Router({ mergeParams: true });

// Post request to create a new review
reviewRoutes.post("/:productID", isLoggedIn, createReview);

export default reviewRoutes;
