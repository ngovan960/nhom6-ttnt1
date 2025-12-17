import ProductCompareItem from "../model/ProductCompareItem.js";

export const addToCompare = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) {
      return res.status(400).json({ message: "userId and productId are required" });
    }

    const existed = await ProductCompareItem.findOne({ where: { userId, productId } });
    if (existed) return res.json({ data: existed });

    const created = await ProductCompareItem.create({ userId, productId });
    return res.status(201).json({ data: created });
  } catch (err) {
    return res.status(500).json({ message: "Add compare failed", error: err.message });
  }
};

export const removeFromCompare = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) {
      return res.status(400).json({ message: "userId and productId are required" });
    }

    await ProductCompareItem.destroy({ where: { userId, productId } });
    return res.json({ data: { removed: true } });
  } catch (err) {
    return res.status(500).json({ message: "Remove compare failed", error: err.message });
  }
};

export const getCompareList = async (req, res) => {
  try {
    const { userId } = req.params;
    const list = await ProductCompareItem.findAll({ where: { userId } });
    return res.json({ data: list });
  } catch (err) {
    return res.status(500).json({ message: "Get compare list failed", error: err.message });
  }
};

export const clearCompare = async (req, res) => {
  try {
    const { userId } = req.params;
    await ProductCompareItem.destroy({ where: { userId } });
    return res.json({ data: { cleared: true } });
  } catch (err) {
    return res.status(500).json({ message: "Clear compare failed", error: err.message });
  }
};
