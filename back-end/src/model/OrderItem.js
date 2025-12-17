import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const OrderItem = sequelize.define(
  "OrderItem",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "OrderItems",
    timestamps: true,
  }
);

/* ================= ASSOCIATIONS ================= */
OrderItem.associate = (models) => {
  OrderItem.belongsTo(models.Order, {
    foreignKey: "order_id",
  });

  OrderItem.belongsTo(models.Product, {
    foreignKey: "product_id",
  });
};

export default OrderItem;
