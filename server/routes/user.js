import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getUsers,
  addUser,
  deleteUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/add", authMiddleware, addUser);
userRouter.get("/", authMiddleware, getUsers);
userRouter.delete("/:id", authMiddleware, deleteUser);

export default userRouter;
