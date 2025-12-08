"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Phương thức 'up' được chạy khi bạn thực hiện migration
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Orders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      // Khóa ngoại liên kết với bảng 'Users'
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT", // Không xóa User nếu họ có Orders
      },
      // Khóa ngoại liên kết với bảng 'Addresses' (Địa chỉ giao hàng)
      address_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Addresses",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      // Khóa ngoại liên kết với bảng 'Coupons' (Nếu bạn có dùng Coupon)
      coupon_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // Cho phép NULL vì không phải đơn hàng nào cũng dùng coupon
        references: {
          model: "Coupons",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL", // Khi coupon bị xóa, Order vẫn giữ nguyên nhưng coupon_id bị đặt NULL
      },
      total_price: {
        type: Sequelize.DECIMAL(10, 2), // Tổng giá trị đơn hàng
        allowNull: false,
      },
      shipping_fee: {
        type: Sequelize.DECIMAL(10, 2), // Phí vận chuyển
        allowNull: false,
        defaultValue: 0,
      },
      payment_method: {
        type: Sequelize.STRING, // Ví dụ: COD, Credit Card, Bank Transfer
      },
      status: {
        type: Sequelize.ENUM(
          "pending",
          "processing",
          "shipping",
          "completed",
          "cancelled"
        ),
        allowNull: false,
        defaultValue: "pending",
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
    await queryInterface.dropTable("Orders");
  },
};
