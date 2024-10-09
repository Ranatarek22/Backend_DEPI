const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const upload = require("../middlewares/upload"); // Ensure this points to your multer configuration

// POST route to create a new product
router.post(
  "/",
  upload.array("image"),
  productController.createProduct
);

// GET route to get all products
router.get("/", productController.getProducts);

// GET route to get a product by ID
router.get("/:id", productController.getProductById);

module.exports = router;
