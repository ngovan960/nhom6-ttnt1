export default (sequelize, DataTypes) => {
  const SalesReportCache = sequelize.define("SalesReportCache", {
    report_type: { type: DataTypes.STRING, allowNull: false }, // daily, monthly
    report_data: { type: DataTypes.JSON, allowNull: false },
    generated_at: { type: DataTypes.DATE, allowNull: false },
  });

  return SalesReportCache;
};
