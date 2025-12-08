"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Phương thức 'up' được chạy khi bạn thực hiện migration
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Wishlists", {
      // Bảng liên kết thường sử dụng hai khóa ngoại làm khóa chính kép
      // (Không cần id tự động tăng nếu dùng khóa chính kép)

      // Trường khóa ngoại liên kết với bảng 'Users'
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true, // Là một phần của khóa chính kép
        references: {
          model: "Users", // Tên bảng đích cho User
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE", // Khi User bị xóa, danh sách yêu thích của họ cũng bị xóa
      },
      // Trường khóa ngoại liên kết với bảng 'Products'
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true, // Là một phần của khóa chính kép
        references: {
          model: "Products", // Tên bảng đích cho Product
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE", // Khi Product bị xóa, nó cũng bị xóa khỏi tất cả Wishlists
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

    // Thêm chỉ mục cho từng khóa ngoại để tối ưu hóa truy vấn
    await queryInterface.addIndex("Wishlists", ["user_id"]);
    await queryInterface.addIndex("Wishlists", ["product_id"]);
  },

  // Phương thức 'down' được chạy khi bạn hoàn tác (undo) migration
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Wishlists");
  },
};
