import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    require: true,
  },
  quantity: {
    type: Number,
    require: true,
  },
  totalPrice: {
    type: Number,
    require: true,
  },
  orderDate: {
    type: Date,
    default: Date.now(),
  },
});

const OrderModel = mongoose.model("Order", orderSchema);
export default OrderModel;
