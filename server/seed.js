import bcrypt from "bcrypt";
import User from "./models/User.js";
import connectDB from "./db/connections.js";

const register = async () => {
  try {
    connectDB();
    const hashPassword = await bcrypt.hash("admin", 10);
    const newUser = new User({
      name: "admin",
      email: "admin@gmail.com",
      password: hashPassword,
      address: "admin address",
      role: "admin",
    });
    await newUser.save();
    console.log("Admin user create successfully");
  } catch (error) {
    console.log(`Admin user create fail ${error}`);
  }
};

register();
