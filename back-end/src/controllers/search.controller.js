import { Op } from "sequelize";
import models from "../model/index.js";

const { Product, Category } = models;

/**
 * 🔍 SEARCH – nhấn Enter
 * GET /api/search?q=keyword
 */
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(200).json({
        total: 0,
        products: [],
      });
    }

    const products = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${q}%` } },
          { description: { [Op.like]: `%${q}%` } },
        ],
      },
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      total: products.length,
      products,
    });
  } catch (error) {
    console.error("SEARCH ERROR:", error);
    return res.status(500).json({ message: "Search failed" });
  }
};

/**
 * 💡 SUGGEST – gõ là có gợi ý
 * GET /api/search/suggest?q=key
 */
export const suggestKeywords = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(200).json({
        products: [],
        categories: [],
      });
    }

    const products = await Product.findAll({
      where: {
        name: { [Op.like]: `${q}%` },
      },
      attributes: ["id", "name"],
      limit: 5,
    });

    const categories = await Category.findAll({
      where: {
        name: { [Op.like]: `${q}%` },
      },
      attributes: ["id", "name"],
      limit: 5,
    });

    return res.status(200).json({
      products,
      categories,
    });
  } catch (error) {
    console.error("SUGGEST ERROR:", error);
    return res.status(500).json({ message: "Suggest failed" });
  }
};
