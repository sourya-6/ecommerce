import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import mime from "mime-types";
import path from "path";

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

    const mimeType = mime.lookup(localFilePath);
    const resourceType = mimeType && mimeType.startsWith("image") ? "image" : "raw";

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: resourceType,
      folder: "snapbuy", // optional
    });

    if (fs.existsSync(localFilePath)) {
      await fs.promises.unlink(localFilePath);
      console.log("🗑️ File deleted successfully:", localFilePath);
    }

    return response;
  } catch (error) {
    console.error("❌ Upload failed:", error);

    if (fs.existsSync(localFilePath)) {
      await fs.promises.unlink(localFilePath);
      console.log("🗑️ Deleted file after failed upload:", localFilePath);
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
