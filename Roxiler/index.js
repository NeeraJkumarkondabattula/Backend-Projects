const express = require("express");
const DatabaseConnection = require("./config/DatabaseConnection");
const axios = require("axios");
const TransactionRouter = require("./route/TransactionRoute");

const app = express();
app.use("/", TransactionRouter);
const PORT = process.env.PORT || 3000;

// Initialize Database from Third-Party API
app.get("/initialize-database", async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const data = response.data;

    // Assuming your table structure has fields like title, description, price, dateOfSale
    const sql = `CREATE TABLE IF NOT EXISTS transactions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255),
      description TEXT,
      price DECIMAL(10, 2),
      dateOfSale DATE
    )`;

    connection.query(sql, (err, result) => {
      if (err) throw err;

      const insertQuery =
        "INSERT INTO transactions (title, description, price, dateOfSale) VALUES ?";
      const values = data.map((item) => [
        item.title,
        item.description,
        item.price,
        item.dateOfSale,
      ]);

      connection.query(insertQuery, [values], (err, result) => {
        if (err) throw err;
        res.send("Database initialized with seed data.");
      });
    });
  } catch (error) {
    console.error("Error initializing database:", error);
    res.status(500).send("Error initializing database");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
