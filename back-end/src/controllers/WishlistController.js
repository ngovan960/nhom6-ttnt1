import Wishlist from "../model/Wishlist.js";

export const toggleWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: "userId and productId are required" });
    }

    const existed = await Wishlist.findOne({ where: { userId, productId } });

    if (existed) {
      await existed.destroy();
      return res.json({ data: { wished: false } });
    }

    await Wishlist.create({ userId, productId });
    return res.json({ data: { wished: true } });
  } catch (err) {
    return res.status(500).json({ message: "Toggle wishlist failed", error: err.message });
  }
};

export const getWishlistByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const list = await Wishlist.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    return res.json({ data: list });
  } catch (err) {
    return res.status(500).json({ message: "Get wishlist failed", error: err.message });
  }
};

