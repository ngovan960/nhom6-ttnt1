"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Phương thức 'up' được chạy khi bạn thực hiện migration
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("AIRecommendations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      // Trường khóa ngoại liên kết với bảng 'AIRequests'
      ai_request_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "AIRequests", // Tên bảng đích cho AIRequest
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      // Trường khóa ngoại liên kết với bảng 'Products'
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Products", // Tên bảng đích cho Product
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      score: {
        // DECIMAL thường được sử dụng cho các giá trị điểm số/tỷ lệ cần độ chính xác
        type: Sequelize.DECIMAL(10, 2), // Ví dụ: 10 chữ số tổng cộng, 2 chữ số sau dấu thập phân
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Thêm chỉ mục duy nhất (unique index) để đảm bảo một sản phẩm chỉ có 1 điểm đề xuất cho mỗi yêu cầu AI
    // Tùy chọn, nhưng thường hữu ích cho các bảng liên kết như thế này
    await queryInterface.addConstraint("AIRecommendations", {
      fields: ["ai_request_id", "product_id"],
      type: "unique",
      name: "unique_ai_request_product_constraint",
    });
  },

  // Phương thức 'down' được chạy khi bạn hoàn tác (undo) migration
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("AIRecommendations");
  },
};
