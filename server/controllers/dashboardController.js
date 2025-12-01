import OrderModel from "../models/Order.js";
import ItemModel from "../models/Item.js";

const getDashboardData = async (req, res) => {
  try {
    const totalProducts = await ItemModel.countDocuments();
    const stockResult = await ItemModel.aggregate([
      { $group: { _id: null, totalStock: { $sum: "$stock" } } },
    ]);
    // console.log(`stockResult aggregate ${JSON.stringify(stockResult)}`);
    const totalStock = stockResult[0]?.totalStock || 0;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const ordersToday = await OrderModel.countDocuments({
      orderDate: { $gte: startOfDay, $lte: endOfDay },
    });

    const revenueResult = await OrderModel.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
    ]);
    const revenue = revenueResult[0]?.totalRevenue || 0;

    const outOfStock = await ItemModel.find({ stock: 0 })
      .select("name stock")
      .populate("category", "categoryName");

    const highestSaleResult = await OrderModel.aggregate([
      { $group: { _id: "$product", totalQuantity: { $sum: "$quantity" } } },
      { $sort: { totalQuantity: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $lookup: {
          from: "categories",
          localField: "product.category",
          foreignField: "_id",
          as: "product.category",
        },
      },
      { $unwind: "$product.category" },
      {
        $project: {
          name: "$product.name",
          category: "$product.category.categoryName",
          totalQuantity: 1,
        },
      },
    ]);
    // console.log(
    //   `highestSaleResult aggregate ${JSON.stringify(highestSaleResult)}`
    // );
    const highestSaleProduct = highestSaleResult[0] || {
      message: "No sale data avaible",
    };

    const lowStock = await ItemModel.find({ stock: { $gt: 0, $lt: 5 } })
      .select("name stock")
      .populate("category", "categoryName");

    const dashboardData = {
      totalProducts,
      totalStock,
      ordersToday,
      revenue,
      outOfStock,
      highestSaleProduct,
      lowStock,
    };

    return res.status(200).json({ success: true, dashboardData });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error in dashboard data retrieval",
    });
  }
};

export { getDashboardData };
