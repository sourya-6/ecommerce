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

router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);
router.get("/get-user-details", verifyJWT, getUserProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", verifyJWT, resetPassword);
router.post("/send-otp", sendOTP);
router.patch("/user-update", verifyJWT, changeUserDetails);
router.post("/verify-email", verifyEmail);

// 📌 **Google Login**
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const token = jwt.sign(
      { _id: req.user._id, role: req.user.role },
      process.env.ACCESS_TOKEN_SECRET, // ✅ Correct secret key
      { expiresIn: "7d" }
    );
    res.send("<a href='https://www.google.com'>Click here to go to dashboard</a>");

    res.cookie("accessToken", token, { httpOnly: true, secure: true });
    res.status(200).json({ success: true, token, message: "Login successful" });
  }
);

export default router;
