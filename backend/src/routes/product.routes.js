import { Router } from "express";

import{createProduct,multipleProductUpload,getAllProducts} from "../controllers/product.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

//import { upload } from "../middlewares/multer.middleware.js";
import multer from "multer";
const router = Router();

router.use(verifyJWT)
const upload = multer({ dest: "uploads/" });

router.post("/create",  upload.array("images", 5), createProduct);

router.post(
  "/bulk-upload",
  upload.fields([
    { name: "images", maxCount: 50 } ,
    { name: "excel", maxCount: 1 } // Single Excel file
    // Max 5 images per product
  ]),
  multipleProductUpload
);
router.get("/",getAllProducts)

export default router