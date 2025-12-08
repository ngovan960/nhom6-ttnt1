import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
const AdminLog = sequelize.define("AdminLog", {
  action: DataTypes.TEXT,
});

AdminLog.associate = (models) => {
  AdminLog.belongsTo(models.User, { foreignKey: "admin_id" });
};

export default AdminLog;
