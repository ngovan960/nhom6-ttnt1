import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Address = sequelize.define("Address", {
  full_name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  address_detail: { type: DataTypes.TEXT, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  district: { type: DataTypes.STRING, allowNull: false },
  ward: { type: DataTypes.STRING, allowNull: false },
  is_default: { type: DataTypes.BOOLEAN, defaultValue: false },
});


Address.associate = (models) => {
  Address.belongsTo(models.User, { foreignKey: "user_id" });
};

export default Address;
