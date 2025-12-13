import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Coupon = sequelize.define(
  "Coupon",
  {
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: DataTypes.TEXT,
    discountType: {
      type: DataTypes.ENUM("percent", "fixed"),
      allowNull: false,
    },
    discountValue: { type: DataTypes.FLOAT, allowNull: false },
    minOrderAmount: DataTypes.FLOAT,
    maxDiscount: DataTypes.FLOAT,
    quantity: DataTypes.INTEGER,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    status: {
      type: DataTypes.ENUM("active", "expired"),
      defaultValue: "active",
    },
  },
  {
    tableName: "Coupons",
    timestamps: true,
  }
);

export default Coupon;
