require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const errorHandler = require("./utils/errorHandler");

const app = express();
connectDB();

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/uploads", express.static("uploads"));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
