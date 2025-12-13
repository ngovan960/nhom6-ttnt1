import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Order = sequelize.define(
  "Order",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    coupon_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    shipping_fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    payment_method: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM(
        "pending",
        "processing",
        "shipping",
        "completed",
        "cancelled"
      ),
      defaultValue: "pending",
    },
  },
  {
    tableName: "Orders",
    timestamps: true,
  }
);

export default Order;
