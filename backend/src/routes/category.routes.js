import { createCategory, deleteCategory } from "../controllers/category.controller.js";
import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);


 router.post("/upload", upload.single("file"), createCategory);

router.post("/delete", deleteCategory);

export default router