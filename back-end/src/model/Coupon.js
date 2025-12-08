export default (sequelize, DataTypes) => {
  const Coupon = sequelize.define("Coupon", {
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: DataTypes.TEXT,
    discountType: {
      type: DataTypes.ENUM("percent", "fixed"),
      allowNull: false,
    },
    discountValue: { type: DataTypes.FLOAT, allowNull: false },
    minOrderAmount: DataTypes.FLOAT,
    maxDiscount: DataTypes.FLOAT,
    quantity: DataTypes.INTEGER,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    status: {
      type: DataTypes.ENUM("active", "expired"),
      defaultValue: "active",
    },
  });

  Coupon.associate = (models) => {
    Coupon.hasMany(models.Order, { foreignKey: "coupon_id" });
  };

  return Coupon;
};
