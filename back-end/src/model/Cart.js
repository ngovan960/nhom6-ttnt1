import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

<<<<<<< HEAD
const Cart = sequelize.define("Cart", {});

Cart.associate = (models) => {
  Cart.belongsTo(models.User, { foreignKey: "user_id" });
  Cart.hasMany(models.CartItem, { foreignKey: "cart_id" });
};

=======
const Cart = sequelize.define(
  "Cart",
  {
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

>>>>>>> feature/compare-related
export default Cart;
