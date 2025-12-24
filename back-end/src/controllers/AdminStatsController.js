import sequelize from "../config/db.js";
import Order from "../model/Order.js";
import OrderItem from "../model/OrderItem.js";
import Product from "../model/Product.js";

// Get Revenue Statistics (Grouped by Date)
export const getRevenueStats = async (req, res) => {
  try {
    const revenue = await Order.findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col("createdAt")), "date"],
        [sequelize.fn("SUM", sequelize.col("total_price")), "revenue"],
        [sequelize.fn("COUNT", sequelize.col("id")), "order_count"],
      ],
      where: {
        status: "completed", // Only count completed orders
      },
      group: [sequelize.fn("DATE", sequelize.col("createdAt"))],
      order: [[sequelize.fn("DATE", sequelize.col("createdAt")), "DESC"]],
    });

    res.status(200).json(revenue);
  } catch (error) {
    console.error("Error fetching revenue stats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Best Selling Products
export const getBestSellingProducts = async (req, res) => {
  try {
    const bestSelling = await OrderItem.findAll({
      attributes: [
        "product_id",
        [sequelize.fn("SUM", sequelize.col("OrderItem.quantity")), "total_sold"],
      ],
      include: [
        {
          model: Product,
          attributes: ["name", "price", "image", "stock"], // Include relevant product info
        },
      ],
      group: ["product_id", "Product.id"], // Group by product_id and Product.id to allow including Product fields
      order: [[sequelize.col("total_sold"), "DESC"]],
      limit: 10, // Top 10 best selling
    });

    res.status(200).json(bestSelling);
  } catch (error) {
    console.error("Error fetching best selling products:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
