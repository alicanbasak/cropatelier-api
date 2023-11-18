import User from "../models/User.js";

const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (user?.isAdmin) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "You are not authorized to access this route",
    });
    return;
  }
};

export default isAdmin;
