const mongoose = require("mongoose");
require("dotenv").config();

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB for Seeding"))
  .catch(err => console.log("DB Connection Error:", err));

// Define Product Schema
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

// Sample Data
const sampleProducts = [
  {
    productId: "P001",
    name: "Amul Milk (1L)",
    mrpPrice: 65.0,
    image: "https://via.placeholder.com/100",
    stock: 50,
    category: "Dairy",
    discounts: "10% off",
    expiryDate: "2025-03-15"
  },
  {
    productId: "P002",
    name: "Fresh Apples (1kg)",
    mrpPrice: 180.0,
    image: "https://via.placeholder.com/100",
    stock: 30,
    category: "Fruits",
    discounts: "5% off",
    expiryDate: "2025-03-10"
  },
  {
    productId: "P003",
    name: "Broccoli (500g)",
    mrpPrice: 70.0,
    image: "https://via.placeholder.com/100",
    stock: 20,
    category: "Vegetables",
    discounts: "15% off",
    expiryDate: "2025-03-12"
  },
  {
    productId: "P004",
    name: "Fortune Sunflower Oil (1L)",
    mrpPrice: 160.0,
    image: "https://via.placeholder.com/100",
    stock: 40,
    category: "Grocery",
    discounts: "10% cashback",
    expiryDate: "2026-06-30"
  },
  {
    productId: "P005",
    name: "Britannia Bread (400g)",
    mrpPrice: 50.0,
    image: "https://via.placeholder.com/100",
    stock: 60,
    category: "Bakery",
    discounts: "Buy 1 Get 1 Free",
    expiryDate: "2025-02-28"
  }
];

// Insert Data into MongoDB
const seedDB = async () => {
  await Product.deleteMany({}); // Clear existing data
  await Product.insertMany(sampleProducts); // Insert new data
  console.log("Sample Products Inserted Successfully!");
  mongoose.connection.close(); // Close DB connection
};

// Run the Seed Function
seedDB();
