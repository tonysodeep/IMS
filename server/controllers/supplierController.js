import ItemModel from "../models/Item.js";
import SupplierModel from "../models/Supplier.js";

const addSupplier = async (req, res) => {
  try {
    const { name, email, phoneNumber, address } = req.body;
    // console.log(` respone body ${JSON.stringify(req.body)}`);
    const existingSupplier = await SupplierModel.findOne({ name });
    if (existingSupplier) {
      return res.status(200).json({
        success: false,
        message: "Supplier already exists",
      });
    }
    const newSupplier = new SupplierModel({
      name,
      email,
      phoneNumber,
      address,
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
    const { name, email, phoneNumber, address } = req.body;
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
        name,
        email,
        phoneNumber,
        address,
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
    const countSupplier = await ItemModel.countDocuments({ supplierId: id });

    if (countSupplier > 0) {
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
