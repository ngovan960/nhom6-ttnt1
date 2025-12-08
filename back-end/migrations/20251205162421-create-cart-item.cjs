"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Phương thức 'up' được chạy khi bạn thực hiện migration
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("CartItems", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      // Trường khóa ngoại liên kết với bảng 'Carts'
      cart_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Carts", // Tên bảng đích cho Cart
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
        onDelete: "CASCADE",
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1, // Thường là 1 khi thêm vào giỏ
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

    // Thêm chỉ mục duy nhất (unique index) để đảm bảo một sản phẩm chỉ xuất hiện 1 lần trong 1 giỏ hàng cụ thể
    await queryInterface.addConstraint("CartItems", {
      fields: ["cart_id", "product_id"],
      type: "unique",
      name: "unique_cart_product_constraint",
    });
  },

  // Phương thức 'down' được chạy khi bạn hoàn tác (undo) migration
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("CartItems");
  },
};
