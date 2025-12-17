import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const CartItem = sequelize.define("CartItem", {
  quantity: DataTypes.INTEGER,
});

CartItem.associate = (models) => {
  CartItem.belongsTo(models.Cart, { foreignKey: "cart_id" });
  CartItem.belongsTo(models.Product, { foreignKey: "product_id" });
};

export default CartItem;
