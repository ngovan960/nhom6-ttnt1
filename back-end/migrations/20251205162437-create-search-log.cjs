"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Phương thức 'up' được chạy khi bạn thực hiện migration
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("SearchLogs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      // Trường khóa ngoại liên kết với bảng 'Users'
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // Cho phép NULL nếu là khách vãng lai (chưa đăng nhập)
        references: {
          model: "Users", // Tên bảng đích cho User
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL", // Khi User bị xóa, lịch sử tìm kiếm của họ vẫn giữ (user_id = NULL)
      },
      keyword: {
        type: Sequelize.STRING, // Từ khóa mà người dùng đã tìm kiếm
        allowNull: false,
      },
      createdAt: {
        allowNull: false, // Dùng để ghi lại thời điểm tìm kiếm
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Thêm index trên keyword và user_id để tối ưu hóa truy vấn phân tích tìm kiếm
    await queryInterface.addIndex("SearchLogs", ["keyword"]);
    await queryInterface.addIndex("SearchLogs", ["user_id"]);
  },

  // Phương thức 'down' được chạy khi bạn hoàn tác (undo) migration
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("SearchLogs");
  },
};
