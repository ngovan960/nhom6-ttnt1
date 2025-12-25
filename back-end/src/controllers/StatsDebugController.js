import db from "../model/index.js";
const { Order, OrderItem, Product, sequelize } = db;

export const getPublicDebugStats = async (req, res) => {
  try {
    const revenue = await Order.findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col("Order.createdAt")), "date"],
        [
          sequelize.literal(`COALESCE(SUM(CASE WHEN status = 'completed' THEN total_price ELSE 0 END), 0)`),
          "revenue",
        ],
        [sequelize.fn("COUNT", sequelize.col("Order.id")), "order_count"],
      ],
      group: [sequelize.fn("DATE", sequelize.col("Order.createdAt"))],
      order: [[sequelize.fn("DATE", sequelize.col("Order.createdAt")), "DESC"]],
    });

    const bestSelling = await OrderItem.findAll({
      attributes: [
        "product_id",
        [sequelize.fn("SUM", sequelize.col("OrderItem.quantity")), "total_sold"],
      ],
      include: [
        {
          model: Product,
          attributes: ["name", "price", "image", "stock"],
        },
      ],
      group: ["product_id", "Product.id"],
      order: [[sequelize.col("total_sold"), "DESC"]],
      limit: 10,
    });

    res.json({
        revenue,
        bestSelling
    });
  } catch (error) {
    console.error("DEBUG STATS ERROR:", error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
};
