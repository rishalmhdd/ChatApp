import jwt from "jsonwebtoken";
import userModel from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    // Get token from either "token" header or "Authorization: Bearer <token>"
    const token = req.headers.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "JWT must be provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await userModel.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Attach user to request and proceed
    req.user = user;
    next();

  } catch (error) {
    console.log("Auth error:", error.message);
    res.status(401).json({ success: false, message: error.message });
  }
};
