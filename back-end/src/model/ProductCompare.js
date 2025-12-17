import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ProductCompare = sequelize.define("ProductCompare", {
  user_id: { type: DataTypes.INTEGER, allowNull: true }, // nếu khách vãng lai thì null
  session_id: { type: DataTypes.STRING, allowNull: true },
});

ProductCompare.associate = (models) => {
  ProductCompare.belongsTo(models.User, { foreignKey: "user_id" });
  ProductCompare.belongsToMany(models.Product, {
    through: "ProductCompareItems",
    foreignKey: "compare_id",
  });
};

export default ProductCompare;
