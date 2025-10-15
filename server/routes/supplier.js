import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addSupplier,
  getSuppliers,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplierController.js";

const supplierRouter = express.Router();

supplierRouter.post("/add", authMiddleware, addSupplier);
supplierRouter.get("/", authMiddleware, getSuppliers);
supplierRouter.put("/:id", authMiddleware, updateSupplier);
supplierRouter.delete("/:id", authMiddleware, deleteSupplier);

export default supplierRouter;
