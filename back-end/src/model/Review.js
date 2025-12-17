import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Review = sequelize.define(
  "Review",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "Reviews",
    timestamps: true,
  }
);

/* ================= ASSOCIATIONS ================= */
Review.associate = (models) => {
  Review.belongsTo(models.User, {
    foreignKey: "user_id",
  });

  Review.belongsTo(models.Product, {
    foreignKey: "product_id",
  });
};

export default Review;
