import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username:{type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'customer', enum: ['admin', 'customer', 'seller'] },
    isSnapXMember: { type: Boolean, default: false },
    snapXExpiry: { type: Date },
    avatar: { type: String ,required: true},
    phoneNumber: { type: String },
    isVerified: { type: Boolean, default: false },
    accessToken: { type: String },
    refreshToken: { type: String },
    resetOTP:{type: String,default:undefined},
    resetOTPExpires:{type: Date,defaultq:undefined},
  },
  { timestamps: true }
);

// Password hashing hook


userSchema.pre("save", async function (next) {
  if(!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10)
  next();
})

userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password, this.password)
}


// Method to generate access token with more user info
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      name: this.name,
      role: this.role,
      avatar: this.avatar,
      isSnapXMember: this.isSnapXMember,
      snapXExpiry: this.snapXExpiry,
      profileImage: this.profileImage,
      phoneNumber: this.phoneNumber,
      isVerified: this.isVerified,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// Method to generate refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};


userSchema.methods.generateOTP=function(){
  const otp = Math.floor(100000 + Math.random() * 900000); 
  console.log(otp)
  this.resetOTP=otp;
  this.resetOTPExpires=Date.now()+5*60*1000;//after 5 minutes
  return otp;
}
const User = mongoose.model('User', userSchema);
export { User } ;
