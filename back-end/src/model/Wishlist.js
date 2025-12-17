import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

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

/* ================= ASSOCIATIONS ================= */
Wishlist.associate = (models) => {
  Wishlist.belongsTo(models.User, {
    foreignKey: "user_id",
  });

  Wishlist.belongsTo(models.Product, {
    foreignKey: "product_id",
  });
};

export default Wishlist;
