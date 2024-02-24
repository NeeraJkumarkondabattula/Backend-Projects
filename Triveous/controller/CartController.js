const pool = require("../config/MySql");
// Add product to cart
async function addToCart(req, res) {
  const { userId, productId, quantity } = req.body;

  // Check if the product is already in the user's cart
  pool.query(
    "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
    [userId, productId],
    (error, results) => {
      if (error) {
        throw error;
      }

      if (results.length > 0) {
        // Update the quantity if product is already in cart
        const newQuantity = results[0].quantity + quantity;
        pool.query(
          "UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?",
          [newQuantity, userId, productId],
          (error, results) => {
            if (error) {
              throw error;
            }
            res
              .status(200)
              .json({ message: "Product quantity updated in cart" });
          }
        );
      } else {
        // Insert the product into the cart
        pool.query(
          "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
          [userId, productId, quantity],
          (error, results) => {
            if (error) {
              throw error;
            }
            res.status(201).json({ message: "Product added to cart" });
          }
        );
      }
    }
  );
}

// Get cart contents
async function getCart(req, res) {
  const { userId } = req.body;

  pool.query(
    "SELECT * FROM cart WHERE user_id = ?",
    [userId],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json({ cart: results });
    }
  );
}

// Update cart
async function updateCart(req, res) {
  const { userId, productId, quantity } = req.body;

  pool.query(
    "UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?",
    [quantity, userId, productId],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json({ message: "Cart updated successfully" });
    }
  );
}

module.exports = { addToCart, getCart, updateCart };
