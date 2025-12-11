import express from "express";
import sequelize from "./config/db.js";
import cors from "cors";

import userRouter from "./routes/userRouter.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connect db

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
connectDB();

// call api

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/api/auth", userRouter);

// run app
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
