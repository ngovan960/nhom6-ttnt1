import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ProductImage = sequelize.define("ProductImage", {
  image_url: DataTypes.STRING,
});

ProductImage.associate = (models) => {
  ProductImage.belongsTo(models.Product, { foreignKey: "product_id" });
};

export default ProductImage;
