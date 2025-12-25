import db from "../model/index.js";

const { Wishlist, Product } = db;

// GET /api/wishlist?user_id=1
export const getWishlist = async (req, res) => {
  try {
    const user_id = Number(req.query.user_id);
    if (!user_id) return res.status(400).json({ message: "user_id is required" });

    const items = await Wishlist.findAll({
      where: { user_id },
      include: [{ model: Product }],
      order: [["createdAt", "DESC"]],
    });

    return res.json({ data: items });
  } catch (err) {
    return res.status(500).json({ message: "Get wishlist failed", error: err.message });
  }
};

// POST /api/wishlist/:productId  body: { "user_id": 1 }
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const { user_id } = req.body;

    if (!user_id) return res.status(400).json({ message: "user_id is required" });

    const p = await Product.findByPk(productId);
    if (!p) return res.status(404).json({ message: "Product not found" });

    const [row] = await Wishlist.findOrCreate({
      where: { user_id, product_id: productId },
      defaults: { user_id, product_id: productId },
    });

    return res.status(201).json({ data: row });
  } catch (err) {
    return res.status(500).json({ message: "Add wishlist failed", error: err.message });
  }
};

// DELETE /api/wishlist/:productId?user_id=1
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const user_id = Number(req.query.user_id);

    if (!user_id) return res.status(400).json({ message: "user_id is required" });

    await Wishlist.destroy({ where: { user_id, product_id: productId } });
    return res.json({ data: { removed: true } });
  } catch (err) {
    return res.status(500).json({ message: "Remove wishlist failed", error: err.message });
  }
};
