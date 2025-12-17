import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

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

    payment_method: {
      type: DataTypes.STRING,
    },

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

/* ================= ASSOCIATIONS ================= */
Order.associate = (models) => {
  Order.belongsTo(models.User, {
    foreignKey: "user_id",
  });

  Order.belongsTo(models.Address, {
    foreignKey: "address_id",
  });

  Order.hasMany(models.OrderItem, {
    foreignKey: "order_id",
  });

  Order.hasMany(models.OrderStatusHistory, {
    foreignKey: "order_id",
  });

  Order.hasOne(models.Payment, {
    foreignKey: "order_id",
  });
};

export default Order;
