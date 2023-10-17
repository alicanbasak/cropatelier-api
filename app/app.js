import express from "express";
import dotenv from "dotenv";
import dbConnect from "../config/db-connect.js";
import userRoutes from "../routes/user.routes.js";
import productRoutes from "../routes/product.routes.js";
import categoryRoutes from "../routes/category.routes.js";
import colorRoutes from "../routes/color.routes.js";
import reviewRoutes from "../routes/review.routes.js";
import {
  globalErrorHandler,
  notFound,
} from "../middlewares/global-error-handler.js";

// Load env vars
dotenv.config();

// Connect to database
dbConnect();

// Initialize express
const app = express();

// Set body parser
app.use(express.json());

// Mount routes
app.use("/api/v1/users/", userRoutes);
app.use("/api/v1/products/", productRoutes);
app.use("/api/v1/categories/", categoryRoutes);
app.use("/api/v1/colors/", colorRoutes);
app.use("/api/v1/reviews/", reviewRoutes);

// Error Middleware
app.use(notFound);
app.use(globalErrorHandler);

export default app;
