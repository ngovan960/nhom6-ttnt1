"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Phương thức 'up' được chạy khi bạn thực hiện migration
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Reviews", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      // Trường khóa ngoại liên kết với bảng 'Users'
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // Tên bảng đích cho User
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE", // Khi User bị xóa, đánh giá của họ cũng bị xóa
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
        onDelete: "CASCADE", // Khi Product bị xóa, đánh giá liên quan cũng bị xóa
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // Không thể khai báo validate min/max ở cấp độ migration, nhưng nên giới hạn ở mức độ ứng dụng
      },
      comment: {
        type: Sequelize.TEXT,
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

    // Thêm chỉ mục duy nhất để đảm bảo mỗi người dùng chỉ đánh giá 1 lần cho 1 sản phẩm
    await queryInterface.addConstraint("Reviews", {
      fields: ["user_id", "product_id"],
      type: "unique",
      name: "unique_user_product_review_constraint",
    });

    // Thêm index cho product_id để tối ưu hóa truy vấn hiển thị đánh giá sản phẩm
    await queryInterface.addIndex("Reviews", ["product_id"]);
  },

  // Phương thức 'down' được chạy khi bạn hoàn tác (undo) migration
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Reviews");
  },
};
