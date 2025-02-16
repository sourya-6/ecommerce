import {Router} from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  socialLogin,
  sendOTP,
  getUserProfile,
  changeUserDetails
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import{upload} from "../middlewares/multer.middleware.js"

const router = Router();

// 📌 **User Authentication Routes**

router.route("/register").post(
  upload.fields([
      {
          name:"avatar",
          maxCount:1
      },
      
  ]),
  registerUser)

router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/get-user-details").get(verifyJWT,getUserProfile)
router.route("/forgot-password").post(forgotPassword)
router.route("/reset-password").post(verifyJWT,resetPassword)
router.route("/send-otp").post(sendOTP)
router.route("/user-update").patch(verifyJWT,changeUserDetails)


// 📌 **Password Management Routes**


// 📌 **Email Verification**
router.route("/verify-email").post(verifyEmail);


// 📌 **Social Login**
router.route("/social-login").post(socialLogin);


export default router;
