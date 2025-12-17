import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Review = sequelize.define("Review", {
  rating: DataTypes.INTEGER,
  comment: DataTypes.TEXT,
});

Review.associate = (models) => {
  Review.belongsTo(models.User, { foreignKey: "user_id" });
  Review.belongsTo(models.Product, { foreignKey: "product_id" });
};

export default Review;
