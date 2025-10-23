import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getUsers,
  addUser,
  deleteUser,
  getUser,
  updateUserProfile,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/add", authMiddleware, addUser);
userRouter.get("/", authMiddleware, getUsers);
userRouter.delete("/:id", authMiddleware, deleteUser);
userRouter.get("/profile", authMiddleware, getUser);
userRouter.put("/profile", authMiddleware, updateUserProfile);

export default userRouter;
