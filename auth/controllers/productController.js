const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");

// Create new product
exports.createProduct = async (req, res) => {
  console.log("Creating product...");
   console.log(req.files);
     if (!req.files || req.files.length === 0) {
       return res.status(400).json({ error: "No files uploaded." });
     }
  const { name, description, price, category, subCategory, sizes, bestseller } =
    req.body;
    const images = req.files ? req.files.map((file) => file.path) : [];// Array of image paths

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      image: images, // Store image URLs
      category,
      subCategory,
      sizes: sizes.split(","), // Convert sizes string to array
      bestseller: bestseller === "true", // Convert string to boolean
    });
console.log("Creating product...");
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all products
// exports.getProducts = async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (error) {
//     console.error("Get products error:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    
    // Format the image URLs
    const formattedProducts = products.map(product => ({
      ...product._doc,
      image: product.image.map(img => `${req.protocol}://${req.get('host')}/${img}`) // Create full URL for each image
    }));

    res.json(formattedProducts);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get a single product by ID

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    
    // Format the image URLs
    const formattedProduct = {
      ...product._doc,
      image: product.image.map(img => `${req.protocol}://${req.get('host')}/${img}`) // Create full URL for each image
    };

    res.json(formattedProduct);
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
