import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { addOrder, getOrder } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/add", authMiddleware, addOrder);
orderRouter.get("/", authMiddleware, getOrder);

export default orderRouter;
