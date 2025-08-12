import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyJWT); // all cart routes require login

router.post("/add", addToCart);
router.get("/", getCart);
router.patch("/update", updateCartItem);
router.delete("/remove", removeCartItem);
router.delete("/clear", clearCart);

export default router;
