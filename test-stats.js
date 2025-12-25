import db from "./back-end/src/model/index.js";
const { Order, OrderItem, Product, sequelize } = db;

async function testStats() {
  try {
    console.log("Testing Revenue Stats...");
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
    console.log("Revenue Stats Results:", JSON.stringify(revenue, null, 2));

    console.log("\nTesting Best Sellers...");
    const bestSelling = await OrderItem.findAll({
      attributes: [
        "product_id",
        [sequelize.fn("SUM", sequelize.col("OrderItem.quantity")), "total_sold"],
      ],
      include: [
        {
          model: Product,
          attributes: ["name", "price", ["thumbnail", "image"], "stock"],
        },
      ],
      group: ["product_id", "Product.id"],
      order: [[sequelize.col("total_sold"), "DESC"]],
      limit: 10,
    });
    console.log("Best Selling Results:", JSON.stringify(bestSelling, null, 2));

  } catch (error) {
    console.error("TEST STATS FAILED:", error);
  } finally {
    process.exit();
  }
}

testStats();
