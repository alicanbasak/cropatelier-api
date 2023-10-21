import cloudinaryPackage from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

const cloudinary = cloudinaryPackage.v2;

// config cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// create storage
const storage = new CloudinaryStorage({
  cloudinary,
  allowed_formats: ["jpg", "png", "jpeg", "webp"],
  params: {
    folder: "cropatelier",
  },
});

// init multer

const upload = multer({ storage });

export default upload;
