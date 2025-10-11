import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization != null
        ? req.headers.authorization.split(" ")[1]
        : null;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized! missing token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById({ _id: decoded.id });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized! user not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in auth middleware:", error);
    return res
      .status(500)
      .json({ message: "Internal server error in midleware" });
  }
};

export default authMiddleware;
