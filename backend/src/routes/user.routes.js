import { Router } from "express";
import passport from "passport";
import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  socialLogin,
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
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerUser
);

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

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    session: false, // Redirect frontend if failed
  }),
);

export default router;
