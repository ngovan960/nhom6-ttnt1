import { Op } from "sequelize";
import db from "../model/index.js";

const { Product, ProductImage, sequelize } = db;

/* ======================================================
   GET /api/products
   ====================================================== */
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: ProductImage,
          as: "images",
          attributes: ["id", "image_url"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.json({ data: products });
  } catch (err) {
    return res.status(500).json({
      message: "Get products failed",
      error: err.message,
    });
  }
};

/* ======================================================
   GET /api/products/:id
   ====================================================== */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: ProductImage,
          as: "images",
          attributes: ["id", "image_url"],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({ data: product });
  } catch (err) {
    return res.status(500).json({
      message: "Get product failed",
      error: err.message,
    });
  }
};

// get products theo categories

export const getProductsByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const products = await Product.findAll({
      where: { category_id: categoryId },
      include: [
        {
          model: ProductImage,
          as: "images",
          attributes: ["id", "image_url"],
        },
      ],
    });

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this category" });
    }

    return res.json({ data: products });
  } catch (err) {
    return res.status(500).json({
      message: "Get products by category failed",
      error: err.message,
    });
  }
};

/* ======================================================
   POST /api/products
   BODY: { ..., images: [] }
   ====================================================== */
export const createProduct = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      name,
      description,
      price,
      discount_price,
      thumbnail,
      stock,
      category_id,
      images = [],
    } = req.body;

    if (!name || price == null) {
      return res.status(400).json({
        message: "name and price are required",
      });
    }

    const product = await Product.create(
      {
        name,
        description,
        price,
        discount_price,
        thumbnail,
        stock,
        category_id,
      },
      { transaction: t }
    );

    if (Array.isArray(images) && images.length > 0) {
      const imageData = images.map((url) => ({
        product_id: product.id,
        image_url: url,
      }));

      await ProductImage.bulkCreate(imageData, { transaction: t });
    }

    await t.commit();

    return res.status(201).json({
      message: "Create product successfully",
      data: product,
    });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({
      message: "Create product failed",
      error: err.message,
    });
  }
};

/* ======================================================
   PUT /api/products/:id
   (có thể update + replace images)
   ====================================================== */
export const updateProduct = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { images, ...productData } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.update(productData, { transaction: t });

    // Nếu gửi images → replace toàn bộ ảnh cũ
    if (Array.isArray(images)) {
      await ProductImage.destroy({
        where: { product_id: id },
        transaction: t,
      });

      if (images.length > 0) {
        const imageData = images.map((url) => ({
          product_id: id,
          image_url: url,
        }));

        await ProductImage.bulkCreate(imageData, { transaction: t });
      }
    }

    await t.commit();

    return res.json({
      message: "Update product successfully",
      data: product,
    });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({
      message: "Update product failed",
      error: err.message,
    });
  }
};

/* ======================================================
   DELETE /api/products/:id
   ====================================================== */
export const deleteProduct = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await ProductImage.destroy({
      where: { product_id: id },
      transaction: t,
    });

    await product.destroy({ transaction: t });

    await t.commit();

    return res.json({ message: "Delete product successfully" });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({
      message: "Delete product failed",
      error: err.message,
    });
  }
};

/* ======================================================
   GET /api/products/:id/related
   ====================================================== */
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
      include: [
        {
          model: ProductImage,
          as: "images",
          attributes: ["id", "image_url"],
        },
      ],
      limit: 6,
      order: [["createdAt", "DESC"]],
    });

    return res.json({ data: relatedProducts });
  } catch (err) {
    return res.status(500).json({
      message: "Get related products failed",
      error: err.message,
    });
  }
};
