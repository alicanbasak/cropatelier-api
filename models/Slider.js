import mongoose from "mongoose";
const Schema = mongoose.Schema;

const SliderSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    image: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
