import express from "express";
import {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const categoryRouter = express.Router();

categoryRouter.post("/add", authMiddleware, addCategory);
categoryRouter.get("/", authMiddleware, getCategories);
categoryRouter.put("/:id", authMiddleware, updateCategory);
categoryRouter.delete("/:id", authMiddleware, deleteCategory);

export default categoryRouter;
