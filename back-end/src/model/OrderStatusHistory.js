import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const OrderStatusHistory = sequelize.define("OrderStatusHistory", {
  status: DataTypes.STRING,
});

OrderStatusHistory.associate = (models) => {
  OrderStatusHistory.belongsTo(models.Order, { foreignKey: "order_id" });
};

export default OrderStatusHistory;
