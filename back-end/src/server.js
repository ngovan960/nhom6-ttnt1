import express from "express";
<<<<<<< HEAD
=======
import cors from "cors";
import sequelize from "./config/db.js";
>>>>>>> feature/compare-related

import cors from "cors";
import couponRoutes from "./routes/coupon.route.js";
import db from "./model/index.js";
import checkoutRoutes from "./routes/checkout.routes.js";
import userRouter from "./routes/userRouter.js";
<<<<<<< HEAD
import addressRoutes from "./routes/address.route.js";
import cartRoutes from "./routes/cart.routes.js";
import paymentRoutes from "./routes/payment.route.js";
import orderRoutes from "./routes/order.route.js";
import searchRoutes from "./routes/search.routes.js";
=======
import productRoutes from "./routes/productRoutes.js";
import compareRoutes from "./routes/compareRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";

>>>>>>> feature/compare-related

const app = express();

/* ================== MIDDLEWARE (ĐẶT TRƯỚC ROUTES) ================== */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

<<<<<<< HEAD
// connect db

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log("✅ DB connected successfully");
  } catch (error) {
    console.error("❌ DB connection failed:", error);
=======
/* ================== DATABASE ================== */
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
>>>>>>> feature/compare-related
  }
})();

/* ================== ROUTES ================== */
app.use("/api", productRoutes);
app.use("/api", compareRoutes);
app.use("/api", reviewRoutes);
app.use("/api", wishlistRoutes);
app.use("/api/auth", userRouter);
<<<<<<< HEAD
app.use("/api/coupons", couponRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api", paymentRoutes);
app.use("/api", orderRoutes);
app.use("/api/search", searchRoutes);
=======
app.use("/api", cartRoutes);
app.use("/api", couponRoutes);
app.use("/api", checkoutRoutes);
>>>>>>> feature/compare-related


/* ================== TEST ================== */
app.get("/", (req, res) => res.send("🚀 API is running"));

/* ================== START SERVER ================== */
app.listen(3000, () => console.log("🚀 Server is running on port 3000"));
