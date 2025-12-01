import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getItem,
  addItem,
  updateItem,
  deleteItem,
} from "../controllers/itemController.js";

const itemRouter = express.Router();

itemRouter.post("/add", authMiddleware, addItem);
itemRouter.get("/", authMiddleware, getItem);
itemRouter.put("/:id", authMiddleware, updateItem);
itemRouter.delete("/:id", authMiddleware, deleteItem);

export default itemRouter;
