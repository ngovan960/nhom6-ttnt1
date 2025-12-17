import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

<<<<<<< HEAD
const Review = sequelize.define("Review", {
  rating: DataTypes.INTEGER,
  comment: DataTypes.TEXT,
});

Review.associate = (models) => {
  Review.belongsTo(models.User, { foreignKey: "user_id" });
  Review.belongsTo(models.Product, { foreignKey: "product_id" });
};
=======
const Review = sequelize.define(
  "Review",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    rating: { type: DataTypes.INTEGER, allowNull: false },
    comment: { type: DataTypes.TEXT, allowNull: true },

    user_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: "Reviews",
    timestamps: true,
  }
);
>>>>>>> feature/compare-related

export default Review;
