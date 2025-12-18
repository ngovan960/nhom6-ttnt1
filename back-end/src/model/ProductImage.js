import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ProductImage = sequelize.define(
  "ProductImage",
  {
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "ProductImages",
    timestamps: true,
  }
);

ProductImage.associate = (models) => {
  ProductImage.belongsTo(models.Product, {
    foreignKey: "product_id",
  });
};

export default ProductImage;
