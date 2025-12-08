"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Phương thức 'up' được chạy khi bạn thực hiện migration
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ProductCompareItems", {
      // Khóa ngoại liên kết với bảng 'ProductCompares' (sử dụng compare_id như đã định nghĩa trong belongsToMany)
      compare_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true, // Là một phần của khóa chính kép
        references: {
          model: "ProductCompares", // Tên bảng đích cho ProductCompare
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE", // Khi danh sách so sánh bị xóa, mục này cũng bị xóa
      },
      // Khóa ngoại liên kết với bảng 'Products'
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true, // Là một phần của khóa chính kép
        references: {
          model: "Products", // Tên bảng đích cho Product
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE", // Khi Sản phẩm bị xóa khỏi hệ thống, mục này cũng bị xóa
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

    // Bảng này không cần trường 'id' tự động tăng vì khóa chính là sự kết hợp của compare_id và product_id.
  },

  // Phương thức 'down' được chạy khi bạn hoàn tác (undo) migration
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ProductCompareItems");
  },
};
