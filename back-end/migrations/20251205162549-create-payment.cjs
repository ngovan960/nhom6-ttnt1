"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Phương thức 'up' được chạy khi bạn thực hiện migration
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Payments", {
      // Trường khóa chính đã được định nghĩa trong mô hình
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      // Khóa ngoại liên kết với bảng 'Orders'
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true, // Thường là UNIQUE vì mỗi Order chỉ có một Payment chính
        references: {
          model: "Orders", // Tên bảng đích
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE", // Khi Order bị xóa, Payment cũng bị xóa
      },

      // Khóa ngoại liên kết với bảng 'Users'
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // Tên bảng đích
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE", // Khi User bị xóa, Payment cũng có thể bị xóa (hoặc dùng RESTRICT tùy chính sách)
      },

      amount: {
        // Sử dụng DECIMAL(12, 2) cho độ chính xác cao về tiền tệ
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },

      method: {
        // Phương thức thanh toán
        type: Sequelize.ENUM("cod", "momo", "vnpay", "banking"),
        allowNull: false,
        defaultValue: "cod",
      },

      status: {
        // Trạng thái thanh toán
        type: Sequelize.ENUM("pending", "paid", "failed", "refunded"),
        allowNull: false,
        defaultValue: "pending",
      },

      paid_at: {
        type: Sequelize.DATE,
        allowNull: true, // Có thể NULL nếu trạng thái là 'pending'
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

    // Thêm chỉ mục cho user_id để tối ưu hóa truy vấn lịch sử thanh toán của người dùng
    await queryInterface.addIndex("Payments", ["user_id"]);
  },

  // Phương thức 'down' được chạy khi bạn hoàn tác (undo) migration
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Payments");
  },
};
