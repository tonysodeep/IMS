import OrderModel from "../models/Order.js";
import ProductModel from "../models/Product.js";

const addOrder = async (req, res) => {
  try {
    const { productId, quantity, total } = req.body;
    const userId = req.user._id;
    const product = await ProductModel.findById({ _id: productId });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: "Not enough stock",
      });
    } else {
      product.stock -= parseInt(quantity);
      await product.save();
    }
    const orderObj = new OrderModel({
      customer: userId,
      product: productId,
      quantity,
      totalPrice: total,
    });
    await orderObj.save();
    return res.status(200).json({
      success: true,
      message: "Order placed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error in Order Placement",
    });
  }
};

const getOrder = async (req, res) => {
  try {
    console.log('run here....')
    const userId = req.user._id;
    let query = {};
    if (req.user.role === "customer") {
      query = { customer: userId };
    }
    const orders = await OrderModel.find()
      .populate({
        path: "product",
        populate: { path: "category", select: "categoryName" },
        select: "name price",
      })
      .populate("customer", "name email");
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error in Order retrieval",
    });
  }
};

export { addOrder, getOrder };
