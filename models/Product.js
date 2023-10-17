import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: Object, ref: "Category", required: true },
    sizes: {
      type: [String],
      enum: ["S", "M", "L", "XL", "XXL"],
      required: true,
    },
    colors: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    images: { type: [String] },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    price: { type: Number, required: true },
    totalQty: { type: Number, required: true },
    totalSold: { type: Number, required: true, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);
//Total revies
ProductSchema.virtual("totalReviews").get(function () {
  return this.reviews.length;
});

//Average rating
ProductSchema.virtual("averageRating").get(function () {
  let sum = 0;
  if (this.reviews.length === 0) {
    return 0;
  } else {
    this.reviews.forEach((review) => {
      sum += review.rating;
    });
    return sum / this.reviews.length;
  }
});

const Product = mongoose.model("Product", ProductSchema);

export default Product;
