"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Phương thức 'up' được chạy khi bạn thực hiện migration
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ProductImages", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      // Trường khóa ngoại liên kết với bảng 'Products'
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false, // Hình ảnh phải thuộc về một sản phẩm
        references: {
          model: "Products", // Tên bảng đích
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE", // Khi Product bị xóa, hình ảnh liên quan cũng bị xóa
      },
      image_url: {
        type: Sequelize.STRING, // URL hoặc đường dẫn đến hình ảnh
        allowNull: false,
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

    // Thêm index trên product_id để tối ưu hóa việc truy vấn tất cả hình ảnh của một sản phẩm
    await queryInterface.addIndex("ProductImages", ["product_id"]);
  },

  // Phương thức 'down' được chạy khi bạn hoàn tác (undo) migration
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ProductImages");
  },
};
