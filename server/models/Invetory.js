import mongoose from "mongoose";

const InvetorySchema = new mongoose.Schema({
  code: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true },
});

const InvetoryModel = mongoose.model("Inventory", InvetorySchema);
export default InvetoryModel;
