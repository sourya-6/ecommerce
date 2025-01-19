// utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload function
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", // Automatically detects file type (image, video, etc.)
    });
    console.log("File Uploaded Successfully!", response.url);
    fs.unlinkSync(localFilePath); // Remove file after upload
    return response;
  } catch {
    fs.unlinkSync(localFilePath); // Remove file if upload fails
    return null;
  }
};

// Delete function
const deleteFromCloudinary = async (cloudinaryFilePath) => {
  try {
    if (!cloudinaryFilePath) return null;
    const filename = cloudinaryFilePath.split("/").pop().split(".")[0];
    const response = await cloudinary.uploader.destroy(filename);
    return response;
  } catch (error) {
    console.log("Error while deleting the file", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
