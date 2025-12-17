import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const OrderItem = sequelize.define("OrderItem", {
  quantity: DataTypes.INTEGER,
  price: DataTypes.DECIMAL,
});

OrderItem.associate = (models) => {
  OrderItem.belongsTo(models.Order, { foreignKey: "order_id" });
  OrderItem.belongsTo(models.Product, { foreignKey: "product_id" });
};

export default OrderItem;
