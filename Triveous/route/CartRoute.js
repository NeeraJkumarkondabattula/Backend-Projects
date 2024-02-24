const express = require("express");
const {
  getCart,
  updateCart,
  addToCart,
} = require("../controller/CartController");
const CartRouter = express.Router();

CartRouter.get("/api/cart", getCart);
CartRouter.post("/api/cart", addToCart);
CartRouter.put("/api/cart", updateCart);

module.exports = CartRouter;
