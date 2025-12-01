import moogoose from "mongoose";

const transactionSchema = new moogoose.Schema({
  itemId: { type: moogoose.Schema.Types.ObjectId, ref: "Item", required: true },
  noteId: { type: moogoose.Schema.Types.ObjectId, ref: "Note", required: true },
  inventoryId: {
    type: moogoose.Schema.Types.ObjectId,
    ref: "Inventory",
    required: true,
  },
  quantity: { type: Number, required: true },
});

const TransactionModel = moogoose.model("Transaction", transactionSchema);
export default TransactionModel;
