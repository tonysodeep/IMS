import ItemModel from "../models/Item.js";

const getItem = async (req, res) => {
  try {
    const items = await ItemModel.find()
      .populate("categoryId", "categoryName")
      .populate("supplierId", "name");

    const formattedItems = items.map((item) => ({
      code: item.code,
      name: item.name,
      type: item.type,
      defaultUnit: item.defaultUnit,
      categoryName: item.categoryId?.categoryName || "",
      supplierName: item.supplierId?.name || "",
      createdAt: item.createdAt,
    }));

    return res.status(200).json({ success: true, items: formattedItems });
  } catch (error) {
    console.error("Error fetching items:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error in items retrieval",
    });
  }
};

const addItem = async (req, res) => {
  try {
    const { code, name, type, defaultUnit, categoryId, supplierId } = req.body;

    const newItem = new ItemModel({
      code,
      name,
      type,
      defaultUnit,
      categoryId,
      supplierId,
    });

    await newItem.save();
    return res.status(201).json({
      success: true,
      message: "Item added successfully",
    });
  } catch (error) {
    console.error("Error adding Item:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, type, defaultUnit, categoryId, supplierId } = req.body;

    const existingItem = await ItemModel.findById(id);
    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }
    const updateItem = await ItemModel.findByIdAndUpdate(
      id,
      {
        code,
        name,
        type,
        defaultUnit,
        categoryId,
        supplierId,
      },
      { new: true }
    );
    if (updateItem) {
      return res.status(200).json({
        success: true,
        message: "Item updated successfully",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Item update failed",
      });
    }
  } catch (error) {
    console.error("Error updating Item:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error in Item update",
    });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const existingItem = await ItemModel.findById(id);
    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    await ItemModel.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error in Item deletion",
    });
  }
};

export { addItem, getItem, updateItem, deleteItem };
