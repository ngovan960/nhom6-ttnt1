export default (sequelize, DataTypes) => {
  const Wishlist = sequelize.define("Wishlist", {});

  Wishlist.associate = (models) => {
    Wishlist.belongsTo(models.User, { foreignKey: "user_id" });
    Wishlist.belongsTo(models.Product, { foreignKey: "product_id" });
  };

  return Wishlist;
};
