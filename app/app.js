import express from "express";
import dotenv from "dotenv";
import dbConnect from "../config/dbConnect.js";
import userRoutes from "../routes/user.routes.js";
import productRoutes from "../routes/product.routes.js";
import {
  globalErrorHandler,
  notFound,
} from "../middlewares/global-error-handler.js";

globalErrorHandler;

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

// Error Middleware
app.use(notFound);
app.use(globalErrorHandler);

export default app;
