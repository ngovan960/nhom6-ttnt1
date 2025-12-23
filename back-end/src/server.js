import express from "express";
import cors from "cors";

import db from "./model/index.js";

/* ===== ROUTES (ĐÚNG TÊN FILE ĐANG CÓ) ===== */
import userRouter from "./routes/userRouter.js";

import productRoutes from "./routes/productRoutes.js";
import compareRoutes from "./routes/compareRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";

import cartRoutes from "./routes/cart.routes.js";
import checkoutRoutes from "./routes/checkout.routes.js";
import couponRoutes from "./routes/coupon.route.js";

import addressRoutes from "./routes/address.route.js";
import paymentRoutes from "./routes/payment.route.js";
import orderRoutes from "./routes/order.route.js";
import searchRoutes from "./routes/search.routes.js";

const app = express();

/* ================== MIDDLEWARE ================== */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================== DATABASE ================== */
(async () => {
  try {

    await db.sequelize.authenticate();
    console.log("✅ DB connected successfully");
  } catch (error) {
    console.error("❌ DB connection failed:", error);
  }
})();

/* ================== ROUTES ================== */
app.use("/api/auth", userRouter);

app.use("/api/products", productRoutes);
app.use("/api/compare", compareRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);

app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/coupons", couponRoutes);

app.use("/api/address", addressRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/search", searchRoutes);

/* ================== TEST ================== */
app.get("/", (req, res) => {
  res.send("🚀 API is running");
});

/* ================== START SERVER ================== */
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
