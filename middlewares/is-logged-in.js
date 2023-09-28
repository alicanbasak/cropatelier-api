import { getTokenFromHeader } from "../utils/get-token-from-header.js";
import { verifyToken } from "../utils/verify-token.js";

export const isLoggedIn = (req, res, next) => {
  // Get token from header
  const token = getTokenFromHeader(req);
  // Verify token and get user id from token payload
  const verified = verifyToken(token);

  // If token is invalid or not provided, throw an error
  if (!verified) {
    throw new Error("Not authorized, token failed");
  } else {
    // Save user id to req object
    req.userId = verified.id;
    next();
  }
};
