import User from "../models/User.js";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generate-token.js";
import { getTokenFromHeader } from "../utils/get-token-from-header.js";
import { verifyToken } from "../utils/verify-token.js";
// @desc    Register a new user
// @route   POST /api/v1/users/register
// @access  Private/Admin

export const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, password } = await req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User already exists");
  }

  // Hash password & create salt for password encryption before saving to database using bcryptjs
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user
  const user = await User.create({
    fullname,
    email,
    password: hashedPassword,
  });

  // If user is created successfully, return a success message
  return res.status(201).json({
    message: "User created successfully",
    data: user,
  });
});

// @desc    Login a user
// @route   POST /api/v1/users/login
// @access  Public

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = await req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }

  // Check if password is correct
  // Compare password entered by user with password in database
  // If password is correct, return a success message

  if (user && (await bcrypt.compare(password, user?.password))) {
    return res.status(200).json({
      message: "User logged in successfully",
      data: user,
      token: generateToken(user?._id),
    });
  } else {
    throw new Error("Invalid email or password");
  }
});

//@desc Get user profile
//@route GET /api/v1/users/profile
//@access Private

export const getUserProfile = asyncHandler(async (req, res) => {
  // Get token from request header
  const token = getTokenFromHeader(req);

  // Verify token and get user id from token payload
  const verified = verifyToken(token);
  console.log(verified);
  return res.json({
    message: "User profile fetched successfully",
    verified,
  });
});
