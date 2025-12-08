export default (sequelize, DataTypes) => {
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

  return Product;
};
