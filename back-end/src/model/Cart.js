import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Cart = sequelize.define("Cart", {});

Cart.associate = (models) => {
  Cart.belongsTo(models.User, { foreignKey: "user_id" });
  Cart.hasMany(models.CartItem, { foreignKey: "cart_id" });
};

export default Cart;
