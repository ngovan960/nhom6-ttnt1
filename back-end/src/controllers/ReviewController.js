import db from "../model/index.js";

// GET /api/products/:productId/reviews
export const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await db.Review.findAll({
      where: { product_id: productId },
      order: [["createdAt", "DESC"]],
    });

    return res.json({ data: reviews });
  } catch (err) {
    return res.status(500).json({ message: "Get reviews failed", error: err.message });
  }
};

// POST /api/products/:productId/reviews
export const createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { user_id, rating, comment } = req.body;

    if (!user_id || rating == null) {
      return res.status(400).json({ message: "user_id and rating are required" });
    }

    const created = await db.Review.create({
      product_id: productId,
      user_id,
      rating,
      comment: comment || null,
    });

    return res.status(201).json({ data: created });
  } catch (err) {
    return res.status(500).json({ message: "Create review failed", error: err.message });
  }
};
