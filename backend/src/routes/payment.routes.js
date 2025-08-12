import { Router } from "express";
import express from "express";
import {createOrder,verifyPayment,razorpayWebhook} from "../controllers/razorpay.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create-order", verifyJWT, createOrder);
router.post("/verify", verifyJWT, verifyPayment);

// webhook route: do NOT require JWT; validate signature instead
router.post("/webhook", express.json({ type: "*/*" }), razorpayWebhook);

export default router;
