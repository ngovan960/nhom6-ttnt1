import db from "../model/index.js";

const { Cart, CartItem, Product, ProductImage } = db;

/**
 * GET /cart
 */
export const getCart = async (req, res) => {
  try {
    // Lấy userId từ token do middleware auth gán
    const userId = req.user.id;
    console.log("userId:", userId);

    // Lấy cart kèm items → product → images
    const cart = await Cart.findOne({
      where: { user_id: userId },
      include: [
        {
          model: CartItem,
          // no alias specified in association; use default "CartItems"
          include: [
            {
              model: Product,
              // no alias specified in association; accessed as `Product`
              include: [
                { model: ProductImage, as: "images" }, // Product.hasMany(ProductImage, { as: 'images' })
              ],
            },
          ],
        },
      ],
    });

    // Nếu cart trống
    if (!cart) return res.json({ items: [] });

    // Map dữ liệu theo format FE cần
    const items = cart.CartItems.map((item) => ({
      _id: item.Product.id,
      name: item.Product.name,
      regularPrice: Number(item.Product.price),
      discountedPrice: Number(item.Product.discount_price),
      thumbnail: item.Product.thumbnail,
      images: (item.Product.images || []).map((img) => img.image_url),
      stock: item.Product.stock,
      isStock: item.Product.stock > 0,
      quantity: item.quantity,
    }));

    res.json({ items });
  } catch (err) {
    console.error("getCart error:", err);
    res.status(500).json({ message: err.message });
  }
};
/**
 * POST /cart/items
 */
export const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.user.id;

  try {
    let cart = await Cart.findOne({ where: { user_id: userId } });

    if (!cart) {
      cart = await Cart.create({ user_id: userId });
    }

    const item = await CartItem.findOne({
      where: { cart_id: cart.id, product_id: productId },
    });

    if (item) {
      item.quantity += quantity;
      await item.save();
    } else {
      await CartItem.create({
        cart_id: cart.id,
        product_id: productId,
        quantity,
      });
    }

    res.status(201).json({ message: "Đã thêm vào giỏ hàng" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * PUT /cart/items/:productId
 */
export const updateCartItem = async (req, res) => {
  const productId = req.params.id;
  const { action } = req.body;
  const userId = req.user.id;

  try {
    if (!productId)
      return res.status(400).json({ message: "product id missing" });
    const cart = await Cart.findOne({ where: { user_id: userId } });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = await CartItem.findOne({
      where: { cart_id: cart.id, product_id: productId },
    });

    if (!item) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    if (action === "decrease") {
      item.quantity -= 1;
      if (item.quantity <= 0) {
        await item.destroy();
      } else {
        await item.save();
      }
    }

    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE /cart/items/:productId
 */
export const removeCartItem = async (req, res) => {
  const productId = req.params.id;
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ where: { user_id: userId } });
    if (!cart) return res.json({ message: "Cart empty" });

    if (!productId)
      return res.status(400).json({ message: "product id missing" });

    await CartItem.destroy({
      where: { cart_id: cart.id, product_id: productId },
    });

    res.json({ message: "Đã xóa sản phẩm" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE /cart/clear
 */
export const clearCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ where: { user_id: userId } });
    if (!cart) return res.json({ message: "Giỏ hàng trống" });

    await CartItem.destroy({ where: { cart_id: cart.id } });

    res.json({ message: "Đã xóa toàn bộ giỏ hàng" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
