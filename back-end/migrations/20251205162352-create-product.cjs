"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Phương thức 'up' được chạy khi bạn thực hiện migration
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Products", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      // Trường khóa ngoại liên kết với bảng 'Categories'
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // Cho phép NULL nếu sản phẩm chưa được gán danh mục
        references: {
          model: "Categories", // Tên bảng đích
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL", // Khi Category bị xóa, category_id của Product sẽ được đặt NULL
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // Tên sản phẩm thường là duy nhất
      },
      description: {
        type: Sequelize.TEXT,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2), // Giá gốc (thường là bắt buộc)
        allowNull: false,
      },
      discount_price: {
        type: Sequelize.DECIMAL(10, 2), // Giá sau khi giảm (có thể NULL)
        allowNull: true,
      },
      thumbnail: {
        type: Sequelize.STRING, // URL hoặc đường dẫn đến hình ảnh chính
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0, // Số lượng tồn kho
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

    // Thêm index cho trường name để tối ưu hóa tìm kiếm sản phẩm
    await queryInterface.addIndex("Products", ["name"]);
  },

  // Phương thức 'down' được chạy khi bạn hoàn tác (undo) migration
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Products");
  },
};
