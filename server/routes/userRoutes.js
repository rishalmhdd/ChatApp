// server/routes/userRoutes.js

import express from "express";
import {
  login,
  signup,
  updateProfile,
  verifyToken,
} from "../controller/userController.js";
import { protectRoute } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.put("/update-profile", protectRoute, updateProfile);
userRouter.get("/check", protectRoute, verifyToken);

export default userRouter;
