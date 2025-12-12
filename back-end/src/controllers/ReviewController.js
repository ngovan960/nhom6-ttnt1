import Review from "../model/Review.js";

export const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.findAll({
      where: { productId },
      order: [["createdAt", "DESC"]],
    });

    return res.json({ data: reviews });
  } catch (err) {
    return res.status(500).json({ message: "Get reviews failed", error: err.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId, rating, comment } = req.body;

    if (!userId || rating == null) {
      return res.status(400).json({ message: "userId and rating are required" });
    }
    if (Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({ message: "rating must be 1..5" });
    }

    const review = await Review.create({
      productId,
      userId,
      rating,
      comment: comment || "",
    });

    return res.status(201).json({ data: review });
  } catch (err) {
    return res.status(500).json({ message: "Create review failed", error: err.message });
  }
};
