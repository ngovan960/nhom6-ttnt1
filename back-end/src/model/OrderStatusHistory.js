export default (sequelize, DataTypes) => {
  const OrderStatusHistory = sequelize.define("OrderStatusHistory", {
    status: DataTypes.STRING,
  });

  OrderStatusHistory.associate = (models) => {
    OrderStatusHistory.belongsTo(models.Order, { foreignKey: "order_id" });
  };

  return OrderStatusHistory;
};
