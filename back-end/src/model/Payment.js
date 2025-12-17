import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Payment = sequelize.define("Payment", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },

  method: {
    type: DataTypes.ENUM("cod", "momo", "vnpay", "banking"),
    allowNull: false,
    defaultValue: "cod",
  },

  status: {
    type: DataTypes.ENUM("pending", "paid", "failed", "refunded"),
    allowNull: false,
    defaultValue: "pending",
  },

  paid_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

Payment.associate = (models) => {
  Payment.belongsTo(models.Order, {
    foreignKey: "order_id",
    onDelete: "CASCADE",
  });

  Payment.belongsTo(models.User, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
  });
};

export default Payment;
