"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Phương thức 'up' được chạy khi bạn thực hiện migration
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Coupons", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // Mã giảm giá phải là duy nhất
      },
      description: {
        type: Sequelize.TEXT,
      },
      discountType: {
        type: Sequelize.ENUM("percent", "fixed"), // Loại giảm giá: phần trăm hay cố định
        allowNull: false,
      },
      discountValue: {
        type: Sequelize.FLOAT, // Giá trị giảm giá
        allowNull: false,
      },
      minOrderAmount: {
        type: Sequelize.FLOAT, // Giá trị đơn hàng tối thiểu để áp dụng
      },
      maxDiscount: {
        type: Sequelize.FLOAT, // Giới hạn giảm giá tối đa (quan trọng nếu discountType là 'percent')
      },
      quantity: {
        type: Sequelize.INTEGER, // Số lượng mã giảm giá khả dụng
      },
      startDate: {
        type: Sequelize.DATE, // Ngày bắt đầu có hiệu lực
      },
      endDate: {
        type: Sequelize.DATE, // Ngày hết hạn
      },
      status: {
        type: Sequelize.ENUM("active", "expired"), // Trạng thái của mã giảm giá
        defaultValue: "active",
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
  },

  // Phương thức 'down' được chạy khi bạn hoàn tác (undo) migration
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Coupons");
  },
};
