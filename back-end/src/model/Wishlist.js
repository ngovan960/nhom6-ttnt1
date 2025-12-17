import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

<<<<<<< HEAD
const Wishlist = sequelize.define("Wishlist", {});

Wishlist.associate = (models) => {
  Wishlist.belongsTo(models.User, { foreignKey: "user_id" });
  Wishlist.belongsTo(models.Product, { foreignKey: "product_id" });
};

=======
const Wishlist = sequelize.define(
  "Wishlist",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    tableName: "Wishlists",
    timestamps: true,
  }
);

>>>>>>> feature/compare-related
export default Wishlist;
