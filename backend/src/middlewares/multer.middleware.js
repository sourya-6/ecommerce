// import multer from "multer";
// import path from "path";

// // ✅ Storage for images
// const imageStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/images"); // Ensure this folder exists
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName);
//   }
// });

// // ✅ Storage for Excel files
// const excelStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/excel"); // Ensure this folder exists
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName);
//   }
// });

// // ✅ File type validation
// const fileFilter = (req, file, cb) => {
//   const imageTypes = [".jpg", ".jpeg", ".png", ".webp"];
//   const excelTypes = [".xls", ".xlsx"];
//   const ext = path.extname(file.originalname).toLowerCase();

//   if (imageTypes.includes(ext) || excelTypes.includes(ext)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only images (.jpg, .jpeg, .png, .webp) and Excel files (.xls, .xlsx) are allowed!"), false);
//   }
// };

// // ✅ Multer Upload Config
// export const upload = multer({
//   storage: (req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) {
//       cb(null, imageStorage);
//     } else {
//       cb(null, excelStorage);
//     }
//   },
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
//   fileFilter, // Validate file type
// });
import multer from "multer";
import path from "path";
import fs from "fs";

// ✅ Create folder if it doesn't exist
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// ✅ Base folder
const BASE_FOLDER = "./public/uploads";

// ✅ Allowed file types
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExts = [".jpg", ".jpeg", ".png", ".webp", ".xls", ".xlsx"];
  if (allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type!"), false);
  }
};

// ✅ Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    let folder = "others"; // default folder
    if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
      folder = file.fieldname === "profilePic" ? "profile" : "images";
    } else if ([".xls", ".xlsx"].includes(ext)) {
      folder = "excel";
    }

    const uploadPath = path.join(BASE_FOLDER, folder);
    ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});


// ✅ Main upload instance
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 10MB
});
