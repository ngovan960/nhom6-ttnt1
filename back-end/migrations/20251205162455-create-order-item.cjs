"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Phương thức 'up' được chạy khi bạn thực hiện migration
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("OrderItems", {
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
        onDelete: "CASCADE", // Khi Order bị xóa, các OrderItem liên quan cũng bị xóa
      },
      // Trường khóa ngoại liên kết với bảng 'Products'
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Products", // Tên bảng đích cho Product
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT", // Không cho phép xóa Product nếu nó đang nằm trong một OrderItem
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2), // Giá của sản phẩm tại thời điểm đặt hàng (Rất quan trọng)
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

    // Thêm chỉ mục duy nhất (unique index) để đảm bảo một sản phẩm chỉ xuất hiện 1 lần trong 1 đơn hàng cụ thể
    await queryInterface.addConstraint("OrderItems", {
      fields: ["order_id", "product_id"],
      type: "unique",
      name: "unique_order_product_constraint",
    });
  },

  // Phương thức 'down' được chạy khi bạn hoàn tác (undo) migration
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("OrderItems");
  },
};
