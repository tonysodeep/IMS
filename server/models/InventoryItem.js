import mongoose from "mongoose";

const InvetoryItemSchema = new mongoose.Schema({
  inventoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Inventory",
    required: true,
  },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  stockQuantity: { type: Number, required: true, default: 0 },
});

const InvetoryItemModel = mongoose.model("InventoryItem", InvetoryItemSchema);
export default InvetoryItemModel;
