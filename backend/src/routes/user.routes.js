import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  socialLogin,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 📌 **User Authentication Routes**
router.use(verifyJWT);
router.post("/register", registerUser); // User Registration
router.post("/login", loginUser); // User Login
router.post("/logout",  logoutUser); // User Logout

// 📌 **Password Management Routes**
router.post("/forgot-password", forgotPassword); // Forgot Password
router.post("/reset-password", resetPassword); // Reset Password

// 📌 **Email Verification**
router.post("/verify-email", verifyEmail); // Verify Email OTP

// 📌 **Social Login**
router.post("/social-login", socialLogin); // Google & Facebook Login

export default router;
