import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Product = sequelize.define(
  "Product",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    discount_price: DataTypes.DECIMAL,
    thumbnail: DataTypes.STRING,
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    category_id: DataTypes.INTEGER,
  },
  {
    tableName: "Products",
    timestamps: true,
  }
);

export default Product;
