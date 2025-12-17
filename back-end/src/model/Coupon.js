import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Coupon = sequelize.define(
  "Coupon",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    description: {
      type: DataTypes.TEXT,
    },

    discountType: {
      type: DataTypes.ENUM("percent", "fixed"),
      allowNull: false,
    },

    discountValue: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    minOrderAmount: {
      type: DataTypes.FLOAT,
    },

    maxDiscount: {
      type: DataTypes.FLOAT,
    },

    quantity: {
      type: DataTypes.INTEGER,
    },

    startDate: {
      type: DataTypes.DATE,
    },

    endDate: {
      type: DataTypes.DATE,
    },

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

/* ================= ASSOCIATIONS ================= */
Coupon.associate = (models) => {
  Coupon.hasMany(models.Order, {
    foreignKey: "coupon_id",
  });
};

export default Coupon;
