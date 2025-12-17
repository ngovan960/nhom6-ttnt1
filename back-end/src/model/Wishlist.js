import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Wishlist = sequelize.define("Wishlist", {});

Wishlist.associate = (models) => {
  Wishlist.belongsTo(models.User, { foreignKey: "user_id" });
  Wishlist.belongsTo(models.Product, { foreignKey: "product_id" });
};

export default Wishlist;
