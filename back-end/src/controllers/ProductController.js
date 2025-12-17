import { Op } from "sequelize";
import db from "../model/index.js";

const { Product } = db;



/**
 * GET /api/products
 */
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      order: [["createdAt", "DESC"]],
    });
    return res.json({ data: products });
  } catch (err) {
    return res.status(500).json({ message: "Get products failed", error: err.message });
  }
};

/**
 * GET /api/products/:id
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({ data: product });
  } catch (err) {
    return res.status(500).json({ message: "Get product failed", error: err.message });
  }
};

/**
 * POST /api/products
 */
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discount_price,
      thumbnail,
      stock,
      category_id,
    } = req.body;

    if (!name || price == null) {
      return res.status(400).json({ message: "name and price are required" });
    }

    const created = await Product.create({
      name,
      description: description || "",
      price,
      discount_price: discount_price || null,
      thumbnail: thumbnail || null,
      stock: stock ?? 0,
      category_id: category_id ?? null,
    });

    return res.status(201).json({ data: created });
  } catch (err) {
    return res.status(500).json({ message: "Create product failed", error: err.message });
  }
};

/**
 * PUT /api/products/:id
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.update(req.body);
    return res.json({ data: product });
  } catch (err) {
    return res.status(500).json({ message: "Update product failed", error: err.message });
  }
};

/**
 * DELETE /api/products/:id
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.destroy();
    return res.json({ data: { deleted: true } });
  } catch (err) {
    return res.status(500).json({ message: "Delete product failed", error: err.message });
  }
};

/**
 * GET /api/products/:id/related
 */
export const getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;

    const currentProduct = await Product.findByPk(id);
    if (!currentProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const relatedProducts = await Product.findAll({
      where: {
        category_id: currentProduct.category_id,
        id: { [Op.ne]: id },
      },
      limit: 6,
      order: [["createdAt", "DESC"]],
    });

    return res.json({ data: relatedProducts });
  } catch (err) {
    return res.status(500).json({ message: "Get related products failed", error: err.message });
  }
};
