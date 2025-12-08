import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Address = sequelize.define("Address", {
  full_name: DataTypes.STRING,
  phone: DataTypes.STRING,
  address_detail: DataTypes.TEXT,
  city: DataTypes.STRING,
  district: DataTypes.STRING,
  ward: DataTypes.STRING,
  is_default: DataTypes.BOOLEAN,
});

Address.associate = (models) => {
  Address.belongsTo(models.User, { foreignKey: "user_id" });
};

export default Address;
