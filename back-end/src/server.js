import express from "express";
import cors from "cors";
import sequelize from "./config/db.js";

import userRouter from "./routes/userRouter.js";
import productRoutes from "./routes/productRoutes.js";
import compareRoutes from "./routes/compareRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";


const app = express();

/* ================== MIDDLEWARE (ĐẶT TRƯỚC ROUTES) ================== */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================== DATABASE ================== */
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  }
};
connectDB();

/* ================== ROUTES ================== */
app.use("/api", productRoutes);
app.use("/api", compareRoutes);
app.use("/api", reviewRoutes);
app.use("/api", wishlistRoutes);
app.use("/api/auth", userRouter);
app.use("/api", cartRoutes);
app.use("/api", couponRoutes);
app.use("/api", checkoutRoutes);


/* ================== TEST ================== */
app.get("/", (req, res) => res.send("🚀 API is running"));

/* ================== START SERVER ================== */
app.listen(3000, () => console.log("🚀 Server is running on port 3000"));
