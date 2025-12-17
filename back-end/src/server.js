import express from "express";

import cors from "cors";
import couponRoutes from "./routes/coupon.route.js";
import db from "./model/index.js";
import checkoutRoutes from "./routes/checkout.routes.js";
import userRouter from "./routes/userRouter.js";
import addressRoutes from "./routes/address.route.js";
import cartRoutes from "./routes/cart.routes.js";
import paymentRoutes from "./routes/payment.route.js";
import orderRoutes from "./routes/order.route.js";
import searchRoutes from "./routes/search.routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connect db

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log("✅ DB connected successfully");
  } catch (error) {
    console.error("❌ DB connection failed:", error);
  }
})();

// call api

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/api/auth", userRouter);
app.use("/api/coupons", couponRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api", paymentRoutes);
app.use("/api", orderRoutes);
app.use("/api/search", searchRoutes);

// run app
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
