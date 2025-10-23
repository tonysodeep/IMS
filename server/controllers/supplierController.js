import ProductModel from "../models/Product.js";
import SupplierModel from "../models/Supplier.js";

const addSupplier = async (req, res) => {
  try {
    const {
      supplierName,
      supplierEmail,
      supplierPhoneNumber,
      supplierAddress,
    } = req.body;
    // console.log(` respone body ${JSON.stringify(req.body)}`);
    const existingSupplier = await SupplierModel.findOne({ supplierName });
    if (existingSupplier) {
      return res.status(200).json({
        success: false,
        message: "Supplier already exists",
      });
    }
    const newSupplier = new SupplierModel({
      name: supplierName,
      email: supplierEmail,
      phoneNumber: supplierPhoneNumber,
      address: supplierAddress,
    });
    await newSupplier.save();
    return res.status(201).json({
      success: true,
      message: "Supplier added successfully",
    });
  } catch (error) {
    console.error("Error adding supplier:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getSuppliers = async (req, res) => {
  try {
    const suppliers = await SupplierModel.find();
    return res.status(200).json({ success: true, suppliers: suppliers });
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error in suppliers retrieval",
    });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      supplierName,
      supplierEmail,
      supplierPhoneNumber,
      supplierAddress,
    } = req.body;
    const existingSupplier = await SupplierModel.findById(id);
    if (!existingSupplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }
    const updatedSupplier = await SupplierModel.findByIdAndUpdate(
      id,
      {
        name: supplierName,
        email: supplierEmail,
        phoneNumber: supplierPhoneNumber,
        address: supplierAddress,
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Supplier updated successfully",
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error in category update",
    });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const countProduct = await ProductModel.countDocuments({ supplier: id });

    if (countProduct > 0) {
      return res.status(202).json({
        success: false,
        message: "Can not delete Supplier assosiated with products",
      });
    }

    const existingSupplier = await SupplierModel.findById(id);
    if (!existingSupplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }
    await SupplierModel.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Supplier deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error in Supplier deletion",
    });
  }
};
export { addSupplier, getSuppliers, updateSupplier, deleteSupplier };
