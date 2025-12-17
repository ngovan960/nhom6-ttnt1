import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

<<<<<<< HEAD
const CartItem = sequelize.define("CartItem", {
  quantity: DataTypes.INTEGER,
});

CartItem.associate = (models) => {
  CartItem.belongsTo(models.Cart, { foreignKey: "cart_id" });
  CartItem.belongsTo(models.Product, { foreignKey: "product_id" });
};

=======
const CartItem = sequelize.define(
  "CartItem",
  {
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

>>>>>>> feature/compare-related
export default CartItem;
