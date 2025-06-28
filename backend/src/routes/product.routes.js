import { Router } from "express";
import {
  createProduct,
  multipleProductUpload,
  getAllProducts,
} from "../controllers/product.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js"; // ✅ Use your custom upload config

const router = Router();

router.use(verifyJWT);

// ✅ Upload single product (5 images)
router.post("/create", upload.array("images", 5), createProduct);

// ✅ Bulk upload products (images + excel)
router.post(
  "/bulk-upload",
  upload.fields([
    { name: "images", maxCount: 50 }, // 5 images * 10 products
    { name: "excel", maxCount: 1 },   // 1 Excel file
  ]),
  multipleProductUpload
);

router.get("/", getAllProducts);

export default router;
