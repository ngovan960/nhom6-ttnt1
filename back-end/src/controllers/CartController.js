import db from "../model/index.js";

const { Cart, CartItem, Product } = db;

const getOrCreateCart = async (user_id) => {
  let cart = await Cart.findOne({ where: { user_id } });
  if (!cart) cart = await Cart.create({ user_id });
  return cart;
};

// GET /api/cart?user_id=1
export const getCart = async (req, res) => {
  try {
    const user_id = Number(req.query.user_id);
    if (!user_id) return res.status(400).json({ message: "user_id is required" });

    const cart = await getOrCreateCart(user_id);

    const items = await CartItem.findAll({
      where: { cart_id: cart.id },
      order: [["createdAt", "DESC"]],
    });

    return res.json({ data: { cart, items } });
  } catch (err) {
    return res.status(500).json({ message: "Get cart failed", error: err.message });
  }
};

// POST /api/cart/items  body: { user_id, product_id, quantity }
export const addToCart = async (req, res) => {
  try {
    const user_id = Number(req.body?.user_id);
    const product_id = Number(req.body?.product_id);
    const quantity = Number(req.body?.quantity ?? 1);

    if (!user_id || !product_id) {
      return res.status(400).json({ message: "user_id & product_id required" });
    }
    if (quantity <= 0) return res.status(400).json({ message: "quantity must be > 0" });

    const product = await Product.findByPk(product_id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const cart = await getOrCreateCart(user_id);

    let item = await CartItem.findOne({
      where: { cart_id: cart.id, product_id },
    });

    if (item) {
      item.quantity += quantity;
      await item.save();
    } else {
      item = await CartItem.create({ cart_id: cart.id, product_id, quantity });
    }

    return res.status(201).json({ data: item });
  } catch (err) {
    return res.status(500).json({ message: "Add to cart failed", error: err.message });
  }
};

// PUT /api/cart/items/:id  body: { quantity }
export const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const quantity = Number(req.body?.quantity);

    const item = await CartItem.findByPk(id);
    if (!item) return res.status(404).json({ message: "Cart item not found" });

    if (!Number.isFinite(quantity)) {
      return res.status(400).json({ message: "quantity is required" });
    }

    if (quantity <= 0) {
      await item.destroy();
      return res.json({ data: { removed: true } });
    }

    item.quantity = quantity;
    await item.save();

    return res.json({ data: item });
  } catch (err) {
    return res.status(500).json({ message: "Update cart item failed", error: err.message });
  }
};

// DELETE /api/cart/items/:id
export const removeCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await CartItem.findByPk(id);
    if (!item) return res.status(404).json({ message: "Cart item not found" });

    await item.destroy();
    return res.json({ data: { removed: true } });
  } catch (err) {
    return res.status(500).json({ message: "Remove cart item failed", error: err.message });
  }
};
