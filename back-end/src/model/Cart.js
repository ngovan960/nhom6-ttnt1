import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Cart = sequelize.define(
  "Cart",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "Carts",
    timestamps: true,
  }
);

/* ================= ASSOCIATIONS ================= */
Cart.associate = (models) => {
  Cart.belongsTo(models.User, {
    foreignKey: "user_id",
  });

  Cart.hasMany(models.CartItem, {
    foreignKey: "cart_id",
  });
};

export default Cart;
