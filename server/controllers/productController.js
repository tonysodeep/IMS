import CategoryModel from "../models/Category.js";
import ProductModel from "../models/Product.js";
import SupplierModel from "../models/Supplier.js";

const getProduct = async (req, res) => {
  try {
    const products = await ProductModel.find({ isDeleted: false })
      .populate("category")
      .populate("supplier");
    const suppliers = await SupplierModel.find();
    const categories = await CategoryModel.find();
    return res
      .status(200)
      .json({ success: true, products, suppliers, categories });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error in products retrieval",
    });
  }
};

const addProduct = async (req, res) => {
  try {
    const {
      productName,
      productDescription,
      productPrice,
      productStock,
      category,
      supplier,
    } = req.body;
    // console.log(` respone body ${JSON.stringify(req.body)}`);

    const newProduct = new ProductModel({
      name: productName,
      description: productDescription,
      price: productPrice,
      stock: productStock,
      category: category,
      supplier: supplier,
    });
    await newProduct.save();
    return res.status(201).json({
      success: true,
      message: "Product added successfully",
    });
  } catch (error) {
    console.error("Error adding Product:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      productName,
      productDescription,
      productPrice,
      productStock,
      category,
      supplier,
    } = req.body;
    const existingProduct = await ProductModel.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    const updateProduct = await ProductModel.findByIdAndUpdate(
      id,
      {
        name: productName,
        description: productDescription,
        price: productPrice,
        stock: productStock,
        category: category,
        supplier: supplier,
      },
      { new: true }
    );
    if (updateProduct) {
      return res.status(200).json({
        success: true,
        message: "Product updated successfully",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Product update failed",
      });
    }
  } catch (error) {
    console.error("Error updating Product:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error in Product update",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProduct = await ProductModel.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    if (existingProduct.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Product already delete successfully",
      });
    }
    await ProductModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error in Product deletion",
    });
  }
};

export { getProduct, addProduct, updateProduct, deleteProduct };
