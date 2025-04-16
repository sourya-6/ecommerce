import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path"; // Import path module

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log("❌ No file path provided!");
      return null;
    }

   

    const ext = path.extname(localFilePath).toLowerCase();
    const isImage = [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext);
    const resourceType = isImage ? "image" : "raw";

   

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: resourceType,
    });

    

    // ✅ Delete file asynchronously
    if (fs.existsSync(localFilePath)) {
      fs.promises.unlink(localFilePath)
        .then(() => console.log("🗑️ File deleted successfully:", localFilePath))
        .catch((err) => console.error("❌ Error deleting file:", err));
    } else {
      console.log("⚠️ File already deleted or not found:", localFilePath);
    }

    return response;
  } catch (error) {
    console.error("❌ Upload failed:", error);

    // Ensure file is deleted even if upload fails
    if (fs.existsSync(localFilePath)) {
      fs.promises.unlink(localFilePath)
        .then(() => console.log("🗑️ Failed upload file deleted:", localFilePath))
        .catch((err) => console.error("❌ Error deleting file after failed upload:", err));
    }

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
