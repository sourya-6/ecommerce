import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { sendWelcomeEmail } from "../utils/nodemailer.js";
import { validateEmail } from "../utils/validateEmail.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ResetOTPgenerated } from "../utils/OTP.js";
// Generate Access Token

// 📌 **User Registration**
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phoneNumber,username } = req.body;
  console.log(name)
  if([name||email||password||phoneNumber].some((field)=>field?.trim() === "")){
    throw new ApiError(400,"All fields are mandatory")
  }
  const emailValidation=validateEmail(email);
  if(!emailValidation){
    throw new ApiError(400,"Invalid email")
  }


  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ApiError(409, "User already exists");

  const avatarlocalPath=req.files?.avatar[0]?.path
  if(!avatarlocalPath){
    throw new ApiError(400,"Fetching avatar failed")
  }
  const avatar =await uploadOnCloudinary(avatarlocalPath)
  if(!avatar.url){
    throw new ApiError(400,"Error while uploading on avatar")
  }

  //const hashedPassword = await bcrypt.hash(password, 10);
  //here we double hashed it which produced error
  const user = await User.create({
    name,
    email,
    password,
    phoneNumber,
    avatar:avatar.url,
    username:username.toLowerCase()
  });
  const createdUser=await User.findById(user._id).select("-password -refreshToken")
  if(!createdUser){
    throw new ApiError(500,"Some thing went wrong while regestering!!")
  }

  // Send Welcome Email
  sendWelcomeEmail(email, name);

  res.status(201).json(
    new ApiResponse(201,createdUser,"User registered successfully"));
});

// 📌 **User Login**
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if(!email||!password){
    throw new ApiError(400,"All fields are mandatory")
  }

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(401, "User not exist");
  
  const isPasswordValid = await user.isPasswordCorrect(password);
  
  if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");

  const accessToken = user.generateAccessToken();
  
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({validateBeforeSave:false});
  const loggedinUser=await User.findById(user._id).select("-password -refreshToken")
  if(!loggedinUser){
    throw new ApiError(500,"Some thing went wrong while logging in!!")
  }
  console.log(user._id)

  const options={
    https:true,
    secure:true
  }
  return res.
  status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(new ApiResponse(200,{
    user:loggedinUser,accessToken,refreshToken
  },"User logged in successfully"))

  
})
// 📌 **User Logout**
const logoutUser = asyncHandler(async (req, res) => {
  console.log("hey")
  // console.log(user._id)
  await User.findByIdAndUpdate(
    req.user._id, 
    { 
      $unset:{
        refreshToken:null
      } });

  res.status(200).json({ success: true, message: "Logged out successfully" });
});
//generate access and refresh token
const generateAccessAndRefreshTokens=async(userId)=>{
  try {
    const user=await User.findById(userId)
    const accessToken=user.generateAccessToken()//generates an access token from the reference of user.model
    const refreshToken=user.generateRefreshToken()//generates an refresh token from the reference of user.model
    user.refreshToken=refreshToken
    await user.save({ validateBeforeSave:false })

    return{accessToken,refreshToken}

} catch (error) {
    throw new ApiError(500,"Something went wrong while generating the access and refresh tokens")
}
}

// 📌 **Forgot Password**
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  const resetToken = jwt.sign({ _id: user._id }, process.env.RESET_TOKEN_SECRET, { expiresIn: "15m" });

  sendEmail(email, "Password Reset", `Your reset token: ${resetToken}`);

  res.status(200).json({ success: true, message: "Password reset token sent to email" });
});


//sending otp

const sendOTP=asyncHandler(async(req,res)=>{
  const {email}=req.body;
  console.log(email)
  const user=await User.findOne({email});
  if(!user){
    throw new ApiError(404,"User not found")
  };
  user.resetOTP=undefined;
  user.resetOTPExpires=undefined;
  const otp=user.generateOTP();
  user.resetOTP=otp;
  user.resetOTPExpires=Date.now()+5*60*1000//after 5 minutes
  await user.save({validateBeforeSave:false})
  const updatedUser=await User.findById(user._id).select("-password -refreshToken")
  if(!updatedUser){
    throw new ApiError(500,"Some thing went wrong while sending the otp")
  }
  ResetOTPgenerated(email,user.name,otp);
  
  
  return res.status(200)
  .json(
    new ApiResponse(201,
      {
        user:updatedUser
      }
      ,"OTP sent successfully")
  )

})
// 📌 **Reset Password**
const resetPassword = asyncHandler(async (req, res) => {
  try {
    const {email,resetOTP,newPassword}=req.body;
    console.log(req.body)
    if(!email||!resetOTP||!newPassword){
      throw new ApiError(400,"All fields are mandatory")
    }
    console.log('test one')
    const user =await User.findOne({email})
    if(!user){
      throw new ApiError(404,"User not found")
    }
    console.log(user)
    console.log('test two')
    console.log(user.resetOTP,user.resetOTPExpires)
    if(user.resetOTP!==resetOTP||user.resetOTPExpires<Date.now()){
      throw new ApiError(400,"Invalid OTP")
    }
    console.log('test three')
    console.log('hello')
    user.password=newPassword;
    console.log('hey')
    user.resetOTP=undefined;
    user.resetOTPExpires=undefined;
    await user.save({validateBeforeSave:false})
    const updatedUser=await User.findById(user._id).select("-password -refreshToken")
    if(!updatedUser){
      throw new ApiError(500,"Some thing went wrong while resetting the password")
    }
  
    return res.status(200)
    .json(
      new ApiResponse(200,user,"Password reset successfully").select("-password -refreshToken")
    )
  } catch (error) {
      throw new ApiError(500,"Something went wrong while resetting the password")
  }
  
});

// 📌 **Verify Email (OTP)**
const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email, otp });

  if (!user) throw new ApiError(400, "Invalid OTP");
  user.isVerified = true;
  user.otp = null;
  await user.save();

  res.status(200).json({ success: true, message: "Email verified successfully" });
});

// 📌 **Social Login (Google, Facebook)**
const socialLogin = asyncHandler(async (req, res) => {
  const { provider, email, name, profileImage } = req.body;

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ name, email, profileImage, isVerified: true });
  }

  const accessToken = generateAccessToken(user);
  res.status(200).json({ success: true, message: "Social login successful", accessToken });
});

// 📌 **Role-Based Access Control Middleware**
const authorizeRoles = (...roles) => {
  return asyncHandler((req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, "Access denied");
    }
    next();
  });
};



export {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    verifyEmail,
    socialLogin,
    authorizeRoles,
    sendOTP
}