import db from "../model/index.js";

const { Cart, CartItem } = db;

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({
      where: { user_id: userId },
      include: {
        model: CartItem,
        include: Product,
      },
    });

    if (!cart) {
      return res.json({ items: [] });
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addToCart = async (req, res) => {
  const { product_id, quantity } = req.body;
  const userId = req.user.id;

  try {
    let cart = await Cart.findOne({ where: { user_id: userId } });

    if (!cart) {
      cart = await Cart.create({ user_id: userId });
    }

    const item = await CartItem.findOne({
      where: {
        cart_id: cart.id,
        product_id,
      },
    });

    if (item) {
      item.quantity += quantity;
      await item.save();
    } else {
      await CartItem.create({
        cart_id: cart.id,
        product_id,
        quantity,
      });
    }

    res.status(201).json({ message: "Đã thêm vào giỏ hàng" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCartItem = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const item = await CartItem.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    if (quantity <= 0) {
      await item.destroy();
    } else {
      item.quantity = quantity;
      await item.save();
    }

    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeCartItem = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await CartItem.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    await item.destroy();
    res.json({ message: "Đã xóa sản phẩm" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const clearCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ where: { user_id: userId } });
    if (!cart) {
      return res.json({ message: "Giỏ hàng trống" });
    }

    await CartItem.destroy({
      where: { cart_id: cart.id },
    });

    res.json({ message: "Đã xóa toàn bộ giỏ hàng" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
