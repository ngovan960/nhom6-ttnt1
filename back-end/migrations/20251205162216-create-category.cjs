"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Phương thức 'up' được chạy khi bạn thực hiện migration
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Categories", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false, // Tên danh mục không được trống
        unique: true, // Đảm bảo tên danh mục là duy nhất
      },
      description: {
        type: Sequelize.TEXT,
      },
      // Trường khóa ngoại cho quan hệ tự liên kết (Parent Category)
      parent_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // Cho phép NULL vì danh mục cấp cao nhất sẽ không có parent
        references: {
          model: "Categories", // Tự tham chiếu đến bảng Categories
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL", // Khi danh mục cha bị xóa, danh mục con sẽ được đặt parent_id = NULL
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
  },

  // Phương thức 'down' được chạy khi bạn hoàn tác (undo) migration
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Categories");
  },
};
