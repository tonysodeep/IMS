import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log(process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`connection create successful`);
  } catch (error) {
    console.log(`connection error ${error}`);
    process.exit(1);
  }
};

export default connectDB;
