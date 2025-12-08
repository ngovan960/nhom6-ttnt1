export default (sequelize, DataTypes) => {
  const SearchLog = sequelize.define("SearchLog", {
    keyword: DataTypes.STRING,
  });

  SearchLog.associate = (models) => {
    SearchLog.belongsTo(models.User, { foreignKey: "user_id" });
  };

  return SearchLog;
};
