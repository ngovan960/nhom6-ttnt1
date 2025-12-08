"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Phương thức 'up' được chạy khi bạn thực hiện migration
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("SalesReportCaches", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      report_type: {
        type: Sequelize.STRING, // Ví dụ: 'daily', 'monthly', 'yearly'
        allowNull: false,
      },
      report_data: {
        type: Sequelize.JSON, // Lưu trữ dữ liệu báo cáo phức tạp dưới dạng JSON
        allowNull: false,
      },
      generated_at: {
        type: Sequelize.DATE, // Thời điểm báo cáo được tạo (thường dùng để kiểm tra độ mới)
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

    // Thêm index cho report_type để tối ưu hóa việc tìm kiếm các loại báo cáo cụ thể
    await queryInterface.addIndex("SalesReportCaches", ["report_type"]);
  },

  // Phương thức 'down' được chạy khi bạn hoàn tác (undo) migration
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("SalesReportCaches");
  },
};
