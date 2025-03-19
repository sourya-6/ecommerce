// import { ApiError } from "../utils/apiError.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import jwt from "jsonwebtoken";
// import { User } from "../models/user.model.js";

// export const verifyJWT = () =>{
//   return asyncHandler(async (req, res, next) => {
//     try {
//       console.log("test 1 passed")
//       const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
//       console.log("test 2 ")
//       console.log(token)
//       if (!token) {
//         throw new ApiError(401, "Unauthorized access");
//       }

//       const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//       const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

//       if (!user) {
//         throw new ApiError(401, "Invalid access token");
//       }

//       if(user.isActive===false){
//         throw new ApiError(404,"User is not active")
//       }
//       if(roles.length && !roles.includes(user.role))

//       req.user = user;
//       next();
//     } catch (error) {
//       throw new ApiError(401, error?.message || "Invalid access token");
//     }
//   });
// }

import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

//no need of res so we used "_"
export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    //taking accessToken From the cookies if in mobile from the header
    if (!token) {
      throw new ApiError(401, "Unauthorized Author");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    //comparing access with the cookies stored

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});
