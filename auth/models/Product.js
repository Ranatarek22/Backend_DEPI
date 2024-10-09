const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: [String], // Array of strings for image URLs
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
    required: true,
  },
  sizes: {
    type: [String], // Array of sizes
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  bestseller: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Product", productSchema);
