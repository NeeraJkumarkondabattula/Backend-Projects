const express = require("express");
const {
  getOrderHistory,
  getOrderById,
  addOrder,
} = require("../controller/OrderController");
const OrderRouter = express.Router();

OrderRouter.get("/api/orders/:orderId", getOrderById);
OrderRouter.post("/api/orders", addOrder);
OrderRouter.post("/api/orders/history", getOrderHistory);

module.exports = OrderRouter;
