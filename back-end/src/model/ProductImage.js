export default (sequelize, DataTypes) => {
  const ProductImage = sequelize.define("ProductImage", {
    image_url: DataTypes.STRING,
  });

  ProductImage.associate = (models) => {
    ProductImage.belongsTo(models.Product, { foreignKey: "product_id" });
  };

  return ProductImage;
};
