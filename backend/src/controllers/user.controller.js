import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { sendEmail } from "../utils/nodemailer.js";

// Generate Access Token
const generateAccessToken = (user) => {
  return jwt.sign(
    { _id: user._id, email: user.email, role: user.role, isSnapXMember: user.isSnapXMember },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
  return jwt.sign({ _id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

// 📌 **User Registration**
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ApiError(409, "User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phoneNumber,
  });

  // Send Welcome Email
  sendEmail(email, "Welcome to SnapBuy", "Your account has been successfully created!");

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      userId: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

// 📌 **User Login**
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(401, "Invalid credentials");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("accessToken", accessToken, { httpOnly: true, secure: true });
  res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      accessToken,
      userId: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

// 📌 **User Logout**
export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  await User.findByIdAndUpdate(req.user._id, { refreshToken: null });

  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// 📌 **Forgot Password**
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  const resetToken = jwt.sign({ _id: user._id }, process.env.RESET_TOKEN_SECRET, { expiresIn: "15m" });

  sendEmail(email, "Password Reset", `Your reset token: ${resetToken}`);

  res.status(200).json({ success: true, message: "Password reset token sent to email" });
});

// 📌 **Reset Password**
export const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken, newPassword } = req.body;

  try {
    const decoded = jwt.verify(resetToken, process.env.RESET_TOKEN_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) throw new ApiError(404, "User not found");

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    throw new ApiError(400, "Invalid or expired reset token");
  }
});

// 📌 **Verify Email (OTP)**
export const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email, otp });

  if (!user) throw new ApiError(400, "Invalid OTP");
  user.isVerified = true;
  user.otp = null;
  await user.save();

  res.status(200).json({ success: true, message: "Email verified successfully" });
});

// 📌 **Social Login (Google, Facebook)**
export const socialLogin = asyncHandler(async (req, res) => {
  const { provider, email, name, profileImage } = req.body;

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ name, email, profileImage, isVerified: true });
  }

  const accessToken = generateAccessToken(user);
  res.status(200).json({ success: true, message: "Social login successful", accessToken });
});

// 📌 **Role-Based Access Control Middleware**
export const authorizeRoles = (...roles) => {
  return asyncHandler((req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, "Access denied");
    }
    next();
  });
};
