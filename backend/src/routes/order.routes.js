import { Router } from "express";
import { getAllOrders,getMyOrders,getOrderById } from "../controllers/order.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
const router = Router();

router.use(verifyJWT); // Apply JWT verification to all order routes
router.get("/", getAllOrders);
router.get("/my-orders", getMyOrders);
router.get("/:id", getOrderById);

export default router;
