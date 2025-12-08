export default (sequelize, DataTypes) => {
  const Category = sequelize.define("Category", {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    parent_id: DataTypes.INTEGER,
  });

  Category.associate = (models) => {
    Category.hasMany(models.Product, { foreignKey: "category_id" });
    Category.belongsTo(models.Category, {
      foreignKey: "parent_id",
      as: "parent",
    });
  };

  return Category;
};
