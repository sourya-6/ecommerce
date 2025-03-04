import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  sendOTP,
  getUserProfile,
  changeUserDetails,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// 📌 **User Authentication Routes**
router.post(
  "/register",
  upload.fields([{ name: "avatar", maxCount: 1 }]),
  registerUser
);
router.get("/", (req, res) => {
  res.send('<a href="http://localhost:4000/api/v1/user/google">Login</a>');
});

router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);
router.get("/get-user-details", verifyJWT, getUserProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", verifyJWT, resetPassword);
router.post("/send-otp", sendOTP);
router.patch("/user-update", verifyJWT, changeUserDetails);

// 📌 **Email Verification**
router.post("/verify-email", verifyEmail);

// 📌 **Social Login (Google Authentication)**
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// ✅ **Google Callback Route**
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/h", session: false }),
  (req, res) => {
    if (!req.user) {
      return res.status(403).json({
        success: false,
        message: "Google authentication failed",
      });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Return JSON Response (NO REDIRECT)
    return res.status(200).json({
      success: true,
      message: "Google login successful",
      user: {
        id: req.user._id,
        name: req.user.username,
        email: req.user.email,
        avatar: req.user.avatar,
      },
      token,
    });
  }
);

export default router;
