import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
const AIRequest = sequelize.define("AIRequest", {
  user_message: DataTypes.TEXT,
});

AIRequest.associate = (models) => {
  AIRequest.belongsTo(models.User, { foreignKey: "user_id" });
  AIRequest.hasMany(models.AIRecommendation, { foreignKey: "ai_request_id" });
};

export default AIRequest;
