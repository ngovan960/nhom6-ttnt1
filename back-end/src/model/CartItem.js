import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const CartItem = sequelize.define(
  "CartItem",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    cart_id: {
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
  },
  {
    tableName: "CartItems",
    timestamps: true,
  }
);

/* ================= ASSOCIATIONS ================= */
CartItem.associate = (models) => {
  CartItem.belongsTo(models.Cart, {
    foreignKey: "cart_id",
  });

  CartItem.belongsTo(models.Product, {
    foreignKey: "product_id",
  });
};

export default CartItem;
