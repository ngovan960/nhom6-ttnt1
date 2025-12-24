import { Op } from "sequelize";
import db from "../model/index.js";

const { Product, AIRequest, AIRecommendation } = db;

export const suggestProducts = async (req, res) => {
    const { message } = req.body;
    const userId = req.user ? req.user.id : null; // Có thể null nếu chưa login, nhưng route này thường authenticated

    try {
        if (!message) {
            return res.status(400).json({ message: "Vui lòng nhập nội dung tư vấn" });
        }

        // 1. Phân tích từ khóa đơn giản (Keyword extraction)
        // Tách các từ trong message, bỏ từ stopwords tiếng Việt cơ bản (nếu cần)
        // Ở đây demo tìm kiếm 'like' theo message
        const keywords = message.split(" ").filter((w) => w.length > 2); // logic đơn giản: lấy từ > 2 ký tự

        // 2. Tìm kiếm sản phẩm
        // Tìm sản phẩm có tên hoặc mô tả chứa từ khóa
        // Dùng Op.or cho tên và description

        // Tạo mảng điều kiện OR cho mỗi từ khóa tìm thấy
        const likeConditions = keywords.map(w => ({
            [Op.or]: [
                { name: { [Op.like]: `%${w}%` } },
                { description: { [Op.like]: `%${w}%` } }
            ]
        }));

        // Kết hợp tất cả điều kiện: Product phải match ít nhất 1 từ khóa (hoặc cải thiện logic match nhiều hơn)
        // Ở đây ta dùng Op.or cho danh sách từ khóa -> có từ nào dính là lấy
        const products = await Product.findAll({
            where: {
                [Op.or]: likeConditions
            },
            limit: 5, // Top 5 suggestion
        });

        // 3. (Optional) Lưu Request và Recommendation
        if (userId) {
            const newRequest = await AIRequest.create({
                user_id: userId,
                user_message: message
            });

            // Bulk insert recommendations
            if (products.length > 0) {
                const recommendationsData = products.map(p => ({
                    ai_request_id: newRequest.id,
                    product_id: p.id,
                    score: 1.0 // Mock score
                }));
                await AIRecommendation.bulkCreate(recommendationsData);
            }
        }

        // 4. Trả về format tin nhắn
        // Mock AI response text
        let replyText = "Dựa trên nhu cầu của bạn, tôi tìm thấy một số sản phẩm phù hợp:";
        if (products.length === 0) {
            replyText = "Xin lỗi, tôi chưa tìm thấy sản phẩm nào khớp với mô tả của bạn. Bạn có thể thử từ khóa khác (ví dụ: 'laptop gaming', 'iphone').";
        }

        res.json({
            message: replyText,
            products: products
        });

    } catch (error) {
        console.error("AI Suggestion Error:", error);
        res.status(500).json({ message: "Lỗi xử lý AI" });
    }
};
