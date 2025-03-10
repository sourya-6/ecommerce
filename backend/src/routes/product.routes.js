import { Router } from "express";
import jwt from "jsonwebtoken";
import{createProduct} from "../controllers/product.controller.js"
import multer from "multer";

const router = Router();

