import multer from "multer";
import path from "path";

// ✅ Storage for images
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images"); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

// ✅ Storage for Excel files
const excelStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/excel"); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

// ✅ File type validation
const fileFilter = (req, file, cb) => {
  const imageTypes = [".jpg", ".jpeg", ".png", ".webp"];
  const excelTypes = [".xls", ".xlsx"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (imageTypes.includes(ext) || excelTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only images (.jpg, .jpeg, .png, .webp) and Excel files (.xls, .xlsx) are allowed!"), false);
  }
};

// ✅ Multer Upload Config
export const upload = multer({
  storage: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, imageStorage);
    } else {
      cb(null, excelStorage);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
  fileFilter, // Validate file type
});
