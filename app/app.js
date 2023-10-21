import express from "express";
import dotenv from "dotenv";
import dbConnect from "../config/db-connect.js";
import userRoutes from "../routes/user.routes.js";
import productRoutes from "../routes/product.routes.js";
import categoryRoutes from "../routes/category.routes.js";
import colorRoutes from "../routes/color.routes.js";
import reviewRoutes from "../routes/review.routes.js";
import orderRoutes from "../routes/order.routes.js";
import {
  globalErrorHandler,
  notFound,
} from "../middlewares/global-error-handler.js";
import couponRoutes from "../routes/coupon.routes.js";
import cors from "cors";

// Load env vars
dotenv.config();

// Enable CORS
app.use(cors());

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
app.use("/api/v1/orders/", orderRoutes);
app.use("/api/v1/coupons/", couponRoutes);

// Error Middleware
app.use(notFound);
app.use(globalErrorHandler);

export default app;
