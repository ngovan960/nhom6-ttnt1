"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Phương thức 'up' được chạy khi bạn thực hiện migration
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ProductCompares", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      // Trường khóa ngoại liên kết với bảng 'Users'
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // Cho phép NULL nếu là khách vãng lai
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL", // Khi User bị xóa, danh sách so sánh của họ vẫn tồn tại (nhưng user_id là NULL)
      },
      // ID phiên cho khách vãng lai
      session_id: {
        type: Sequelize.STRING,
        allowNull: true, // Cho phép NULL nếu là người dùng đã đăng nhập
        // Có thể thêm UNIQUE nếu bạn muốn mỗi session_id chỉ có 1 danh sách so sánh
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

    // Thêm ràng buộc để đảm bảo mỗi User HOẶC mỗi Session chỉ có một danh sách so sánh duy nhất (tùy chọn)
    // Tuy nhiên, vì cả hai đều có thể NULL, việc thêm ràng buộc UNIQUE phức tạp hơn.
    // Nếu muốn đảm bảo UNIQUE, bạn cần phải xử lý logic này ở tầng ứng dụng hoặc thêm các ràng buộc CHECK phức tạp.

    // Thêm chỉ mục cho user_id và session_id để tối ưu hóa truy vấn
    await queryInterface.addIndex("ProductCompares", ["user_id"]);
    await queryInterface.addIndex("ProductCompares", ["session_id"]);
  },
  // Phương thức 'down' được chạy khi bạn hoàn tác (undo) migration
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ProductCompares");
  },
};
