import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/add", authMiddleware, addProduct);
productRouter.get("/", authMiddleware, getProduct);
productRouter.put("/:id", authMiddleware, updateProduct);
productRouter.delete("/:id", authMiddleware, deleteProduct);

export default productRouter;
