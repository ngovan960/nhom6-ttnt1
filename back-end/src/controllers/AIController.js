import { Op } from "sequelize";
import db from "../model/index.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const { Product, AIRequest, AIRecommendation } = db;

// Initialize Gemini
let genAI;
/**
 * Khởi tạo và lấy đối tượng Google Generative AI (Gemini).
 * @returns {GoogleGenerativeAI} Đối tượng Gemini AI.
 */
const getAI = () => {
    if (!genAI) {
        const key = process.env.GEMINI_API_KEY;
        if (!key) {
            console.error("CRITICAL: GEMINI_API_KEY is not defined in environment variables");
        }
        genAI = new GoogleGenerativeAI(key);
    }
    return genAI;
};

/**
 * So sánh các sản phẩm dựa trên ID bằng AI Gemini.
 * @param {Object} req - Đối tượng request, chứa body.productIds (mảng ID sản phẩm).
 * @param {Object} res - Đối tượng response.
 */
export const compareProducts = async (req, res) => {
    const { productIds } = req.body;
    
    try {
        console.log("AI Comparison request for IDs:", productIds);
        if (!productIds || !Array.isArray(productIds) || productIds.length < 2) {
            return res.status(400).json({ message: "Vui lòng chọn ít nhất 2 sản phẩm để so sánh" });
        }

        const products = await Product.findAll({
            where: {
                id: { [Op.in]: productIds }
            }
        });

        if (products.length < 2) {
            return res.status(404).json({ message: "Không tìm thấy đủ sản phẩm để so sánh" });
        }

        const ai = getAI();
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

        const productData = products.map(p => `Name: ${p.name}\nBrand: ${p.brand}\nDescription: ${p.description}\nPrice: ${p.price}\n---`).join("\n");
        
        const prompt = `
        Bạn là một chuyên gia đánh giá đồ công nghệ. Hãy so sánh các sản phẩm sau đây dựa trên cấu hình và đặc điểm của chúng:
        
        ${productData}
        
        Hãy cung cấp phản hồi dưới định dạng JSON sau (KHÔNG CÓ QUOTE CODE BLOCK, CHỈ TRẢ VỀ JSON):
        {
            "verdict": "Lời khuyên tổng quan về sản phẩm nào tốt nhất và tại sao",
            "reasoning": "Giải thích chi tiết hơn về sự khác biệt",
            "highlights": [
                {"title": "Tên tiêu chí (ví dụ: Hiệu năng)", "text": "Mô tả ngắn gọn sự khác biệt", "color": "blue | green | orange", "icon": "bolt | speed | visibility | etc"}
            ],
            "recommendation": "Tên sản phẩm được khuyên dùng nhất"
        }
        `;

        console.log("Sending prompt to Gemini...");
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("Raw response from Gemini:", text);
        
        // Clean up the response if it contains markdown code blocks
        const jsonContent = text.replace(/```json\n?|```/g, "").trim();
        let aiAnalysis;
        try {
            aiAnalysis = JSON.parse(jsonContent);
        } catch (parseErr) {
            console.error("Failed to parse Gemini JSON:", parseErr);
            console.log("Attempting to fix JSON...");
            // Simple backup fix for common Gemini issues
            const firstBrace = text.indexOf('{');
            const lastBrace = text.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1) {
                aiAnalysis = JSON.parse(text.substring(firstBrace, lastBrace + 1));
            } else {
                throw parseErr;
            }
        }

        res.json({
            analysis: aiAnalysis,
            products: products
        });

    } catch (error) {
        console.error("AI Comparison Error:", error);
        const isQuotaError = error?.message?.includes('quota') || (error?.details && error.details.some(d => d?.type?.includes('quota')));
        const userMessage = isQuotaError ? 'Hết hạn mức sử dụng Gemini API. Vui lòng kiểm tra quota hoặc sử dụng key khác.' : 'Lỗi xử lý so sánh AI';
        res.status(500).json({
            message: userMessage,
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

/**
 * Tư vấn và gợi ý sản phẩm dựa trên tin nhắn của người dùng bằng cách tìm kiếm từ khóa.
 * @param {Object} req - Đối tượng request, chứa body.message.
 * @param {Object} res - Đối tượng response.
 */
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
