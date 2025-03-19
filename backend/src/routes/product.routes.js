import { Router } from "express";

import{createProduct,test} from "../controllers/product.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

//import { upload } from "../middlewares/multer.middleware.js";
import multer from "multer";
const router = Router();
router.use(verifyJWT)
const upload = multer({ dest: "uploads/" });

router.post("/pro",  upload.array("images", 5), createProduct);


router.get("/test", (req, res) => {
    console.log("Request headers:", req.headers);
    res.json({ message: "Received request" });
  });
  
//router.get("/test", test)
export default router