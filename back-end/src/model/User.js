import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define("User", {
  fullname: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  password_hash: DataTypes.STRING,
  avatar: DataTypes.STRING,
  phone: DataTypes.STRING,
  role: {
    type: DataTypes.ENUM("customer", "admin"),
    defaultValue: "customer",
  },
});

User.associate = (models) => {
  User.hasMany(models.Address, { foreignKey: "user_id" });
  User.hasMany(models.Order, { foreignKey: "user_id" });
  User.hasMany(models.Review, { foreignKey: "user_id" });
  User.hasMany(models.Wishlist, { foreignKey: "user_id" });
  User.hasMany(models.SearchLog, { foreignKey: "user_id" });
  User.hasMany(models.AIRequest, { foreignKey: "user_id" });
  User.hasMany(models.AdminLog, { foreignKey: "admin_id" });
  User.hasMany(models.Payment, { foreignKey: "user_id" });
};

export default User;
