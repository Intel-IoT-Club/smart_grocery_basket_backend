const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors()); // Allow requests from frontend
app.use(express.json()); // Parse JSON body

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

// Product Schema
const productSchema = new mongoose.Schema({
  productId: String,
  name: String,
  mrpPrice: Number,
  image: String,
  stock: Number,
  category: String,
  discounts: String,
  expiryDate: String,
});

const Product = mongoose.model("Product", productSchema);

// Test Route: Fetch all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.listen(5001, () => {
  console.log("Server running on port 5001");
});
