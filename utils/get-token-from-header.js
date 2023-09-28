// This function will get the token from the header and return it to the controller to be used for authentication and authorization purposes.
export const getTokenFromHeader = (req) => {
  const authorization = req.headers.authorization;
  if (authorization && authorization.startsWith("Bearer")) {
    return authorization.split(" ")[1];
  } else {
    throw new Error("Not authorized, token failed");
  }
};
