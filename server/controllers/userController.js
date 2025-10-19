import User from "../models/User.js";
import bcrypt from "bcrypt";

const addUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    console.log(`user body ${JSON.stringify(req.body)}`);
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(200).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      address,
      role,
    });
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User added successfully",
    });
  } catch (error) {
    console.error("Error adding user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error in Adding Uuser",
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error in user retrieval",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    await User.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error in user deletion",
    });
  }
};

export { addUser, getUsers, deleteUser };
