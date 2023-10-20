import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CouponSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Coupon is expired
CouponSchema.virtual("isExpired").get(function () {
  return Date.now() > this.endDate;
});

// Validaiton
CouponSchema.pre("validate", function (next) {
  // Check if coupon is expired
  if (this.isExpired) {
    next(new Error("Coupon is expired"));
  }
  next();
});

CouponSchema.pre("validate", function (next) {
  if (this.discount <= 0 || this.discount > 100) {
    next(new Error("Discount must be between 0 and 100"));
  }
  next();
});

const Coupon = mongoose.model("Coupon", CouponSchema);

export default Coupon;
