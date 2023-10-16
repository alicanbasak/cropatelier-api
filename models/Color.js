import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ColorSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a color name"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Color = mongoose.model("Color", ColorSchema);

export default Color;
