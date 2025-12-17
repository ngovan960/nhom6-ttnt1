import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Order = sequelize.define("Order", {
  total_price: DataTypes.DECIMAL,
  shipping_fee: DataTypes.DECIMAL,
  payment_method: DataTypes.STRING,
  status: DataTypes.ENUM(
    "pending",
    "processing",
    "shipping",
    "completed",
    "cancelled"
  ),
});

Order.associate = (models) => {
  Order.belongsTo(models.User, { foreignKey: "user_id" });
  Order.belongsTo(models.Address, { foreignKey: "address_id" });
  Order.hasMany(models.OrderItem, { foreignKey: "order_id" });
  Order.hasMany(models.OrderStatusHistory, { foreignKey: "order_id" });
  Order.hasOne(models.Payment, { foreignKey: "order_id" });
};
export default Order;
