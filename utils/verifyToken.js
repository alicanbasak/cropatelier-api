import jwt from "jsonwebtoken";

// Desc: Verify token from header and return user id from token payload if token is valid or throw an error if token is invalid or not provided in the header of the request to the protected route in the backend API server. This function will be used in the controllers to verify the token and get the user id from the token payload.

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return false;
    }
    return decoded;
  });
};
