import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const SearchLog = sequelize.define("SearchLog", {
  keyword: DataTypes.STRING,
});

SearchLog.associate = (models) => {
  SearchLog.belongsTo(models.User, { foreignKey: "user_id" });
};

export default SearchLog;
