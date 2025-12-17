import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
<<<<<<< HEAD

const Product = sequelize.define("Product", {
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
  price: DataTypes.DECIMAL,
  discount_price: DataTypes.DECIMAL,
  thumbnail: DataTypes.STRING,
  stock: DataTypes.INTEGER,
});

Product.associate = (models) => {
  Product.belongsTo(models.Category, { foreignKey: "category_id" });
  Product.hasMany(models.ProductImage, { foreignKey: "product_id" });
  Product.hasMany(models.Review, { foreignKey: "product_id" });
  Product.hasMany(models.Wishlist, { foreignKey: "product_id" });
  Product.hasMany(models.OrderItem, { foreignKey: "product_id" });
  Product.hasMany(models.AIRecommendation, { foreignKey: "product_id" });
};

=======

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

>>>>>>> feature/compare-related
export default Product;
