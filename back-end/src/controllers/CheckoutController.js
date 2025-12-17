import db from "../model/index.js";

const { sequelize, Cart, CartItem, Product, Order, OrderItem } = db;

// POST /api/checkout
// body: { user_id, address_id, payment_method, coupon_id? }
export const checkout = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const user_id = Number(req.body?.user_id);
    const address_id = Number(req.body?.address_id);
    const payment_method = req.body?.payment_method || "COD";
    const coupon_id = req.body?.coupon_id ?? null;

    if (!user_id || !address_id) {
      return res.status(400).json({ message: "user_id and address_id are required" });
    }

    // 1) find cart
    const cart = await Cart.findOne({ where: { user_id } });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // 2) cart items
    const items = await CartItem.findAll({ where: { cart_id: cart.id } });
    if (!items.length) return res.status(400).json({ message: "Cart is empty" });

    // 3) calc total
    let total = 0;
    for (const item of items) {
      const product = await Product.findByPk(item.product_id);
      if (!product) return res.status(404).json({ message: `Product ${item.product_id} not found` });
      total += Number(product.price) * item.quantity;
    }

    // 4) create order
    const order = await Order.create(
      {
        user_id,
        address_id,
        coupon_id,
        total_price: total,
        shipping_fee: 0,
        payment_method,
        status: "pending",
      },
      { transaction: t }
    );

    // 5) create order items
    for (const item of items) {
      const product = await Product.findByPk(item.product_id);

      await OrderItem.create(
        {
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: product.price,
        },
        { transaction: t }
      );
    }

    // 6) clear cart items
    await CartItem.destroy({ where: { cart_id: cart.id }, transaction: t });

    await t.commit();
    return res.json({ data: order });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ message: "Checkout failed", error: err.message });
  }
};
