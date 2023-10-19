import mongoose from "mongoose";
const Schema = mongoose.Schema;

//Generate order text
const randomText = Math.random().toString(36).substring(7).toLocaleUpperCase();

// Gerenate order number
const randomNum = Math.floor(1000 + Math.random() * 90000);
const OrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    orderItems: [{ type: Object, required: true }],
    shippingAddress: {
      type: Object,
      required: true,
    },
    orderNumber: {
      type: String,
      default: `${randomText}${randomNum}`,
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["paid", "unpaid"],
      default: "unpaid",
    },
    paymentMethod: {
      type: String,
      required: true,
      default: "Not Specified",
    },
    currency: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "processing", "shipped", "cancelled", "completed"],
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// compile model from schema
const Order = mongoose.model("Order", OrderSchema);

export default Order;
