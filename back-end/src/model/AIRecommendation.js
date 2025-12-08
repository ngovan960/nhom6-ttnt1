import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
const AIRecommendation = sequelize.define("AIRecommendation", {
  score: DataTypes.DECIMAL,
});

AIRecommendation.associate = (models) => {
  AIRecommendation.belongsTo(models.AIRequest, {
    foreignKey: "ai_request_id",
  });
  AIRecommendation.belongsTo(models.Product, { foreignKey: "product_id" });
};

export default AIRecommendation;
