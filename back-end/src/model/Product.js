import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
    },

    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },

    discount_price: {
      type: DataTypes.DECIMAL,
    },

    thumbnail: {
      type: DataTypes.STRING,
    },

    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    category_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "Products",
    timestamps: true,
  }
);

/* ================= ASSOCIATIONS ================= */
Product.associate = (models) => {
  Product.belongsTo(models.Category, {
    foreignKey: "category_id",
  });

  Product.hasMany(models.ProductImage, {
    foreignKey: "product_id",
    as: "images",
  });

  Product.hasMany(models.Review, {
    foreignKey: "product_id",
  });

  Product.hasMany(models.Wishlist, {
    foreignKey: "product_id",
  });

  Product.hasMany(models.OrderItem, {
    foreignKey: "product_id",
  });

  Product.hasMany(models.AIRecommendation, {
    foreignKey: "product_id",
  });
};

export default Product;
