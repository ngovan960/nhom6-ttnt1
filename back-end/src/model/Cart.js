export default (sequelize, DataTypes) => {
  const Cart = sequelize.define("Cart", {});

  Cart.associate = (models) => {
    Cart.belongsTo(models.User, { foreignKey: "user_id" });
    Cart.hasMany(models.CartItem, { foreignKey: "cart_id" });
  };

  return Cart;
};
