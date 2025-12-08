"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Phương thức 'up' được chạy khi bạn thực hiện migration
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("OrderStatusHistories", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      // Trường khóa ngoại liên kết với bảng 'Orders'
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Orders", // Tên bảng đích cho Order
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE", // Khi Order bị xóa, lịch sử trạng thái liên quan cũng bị xóa
      },
      status: {
        type: Sequelize.STRING, // Trạng thái mới của đơn hàng (ví dụ: 'processing', 'shipping', 'completed')
        allowNull: false,
      },
      createdAt: {
        allowNull: false, // Dùng createdAt để ghi lại thời điểm trạng thái thay đổi
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Thêm index trên order_id để tối ưu hóa việc tìm kiếm lịch sử theo đơn hàng
    await queryInterface.addIndex("OrderStatusHistories", ["order_id"]);
  },

  // Phương thức 'down' được chạy khi bạn hoàn tác (undo) migration
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("OrderStatusHistories");
  },
};
