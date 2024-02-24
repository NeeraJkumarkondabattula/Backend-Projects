const pool = require("../config/MySql");

// Category Listing
async function getCategories(req, res) {
  pool.query("SELECT * FROM categories", (error, results) => {
    if (error) throw error;
    res.json({ categories: results });
  });
}

// Add Products
async function addProduct(req, res) {
  const { title, price, description, availability, category_id } = req.body;

  // Check if the category_id exists
  pool.query(
    "SELECT id FROM categories WHERE id = ?",
    [category_id],
    (categoryError, categoryResults) => {
      if (categoryError) {
        console.error("Error checking category:", categoryError);
        return res.status(500).json({ error: "Error adding product" });
      }

      if (categoryResults.length === 0) {
        // Category doesn't exist, return error
        return res.status(400).json({ error: "Category does not exist" });
      }

      // Insert the product into the database
      pool.query(
        "INSERT INTO products (title, price, description, availability, category_id) VALUES (?, ?, ?, ?, ?)",
        [title, price, description, availability, category_id],
        (productError, results) => {
          if (productError) {
            console.error("Error adding product:", productError);
            return res.status(500).json({ error: "Error adding product" });
          }
          // Product added successfully
          res.status(201).json({
            message: "Product added successfully",
            productId: results.insertId,
          });
        }
      );
    }
  );
}

// Product Listing
async function getProductsByCategory(req, res) {
  const { categoryId } = req.body;
  pool.query(
    "SELECT * FROM products WHERE category_id = ?",
    [categoryId],
    (error, results) => {
      if (error) throw error;
      res.json({ products: results });
    }
  );
}

// Product Details
async function getProductById(req, res) {
  const productId = req.params.productId;
  pool.query(
    "SELECT * FROM products WHERE id = ?",
    [productId],
    (error, results) => {
      if (error) throw error;
      if (results.length > 0) {
        res.json({ product: results[0] });
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    }
  );
}

module.exports = {
  getCategories,
  getProductById,
  getProductsByCategory,
  addProduct,
};
