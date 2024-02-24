const express = require("express");
const {
  getProductById,
  getProductsByCategory,
  getCategories,
  addProduct,
} = require("../controller/ProductController");
const ProductRouter = express.Router();

ProductRouter.get("/api/categories", getCategories);
ProductRouter.post("/api/products", addProduct);
ProductRouter.get("/api/products", getProductsByCategory);
ProductRouter.get("/api/products/:productId", getProductById);

module.exports = ProductRouter;
