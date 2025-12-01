import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  defaultUnit: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
  createdAt: { type: Date, default: Date.now },
});

const ItemModel = mongoose.model("Item", ItemSchema);
export default ItemModel;
