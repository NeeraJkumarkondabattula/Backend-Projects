const mysql = require("mysql2");

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  connectionLimit: 10, // Adjust this value based on your requirements
});

// Place order
async function addOrder(req, res) {
  const { user_id, products } = req.body;

  // Start a transaction
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection:", err);
      return res.status(500).json({ error: "Error placing order" });
    }

    connection.beginTransaction((err) => {
      if (err) {
        console.error("Error beginning transaction:", err);
        connection.release();
        return res.status(500).json({ error: "Error placing order" });
      }

      // Insert the order into the database
      connection.query(
        "INSERT INTO orders (user_id) VALUES (?)",
        [user_id],
        (error, results) => {
          if (error) {
            console.error("Error adding order:", error);
            connection.rollback(() => {
              connection.release();
              return res.status(500).json({ error: "Error placing order" });
            });
          }

          const orderId = results.insertId;

          // Insert order details into the database
          const values = products.map((product) => [
            orderId,
            product.productId,
            product.quantity,
          ]);
          connection.query(
            "INSERT INTO order_details (order_id, product_id, quantity) VALUES ?",
            [values],
            (error, results) => {
              if (error) {
                console.error("Error adding order details:", error);
                connection.rollback(() => {
                  connection.release();
                  return res.status(500).json({ error: "Error placing order" });
                });
              }

              // Commit transaction
              connection.commit((err) => {
                if (err) {
                  console.error("Error committing transaction:", err);
                  connection.rollback(() => {
                    connection.release();
                    return res
                      .status(500)
                      .json({ error: "Error placing order" });
                  });
                }
                connection.release();
                res
                  .status(201)
                  .json({ message: "Order placed successfully", orderId });
              });
            }
          );
        }
      );
    });
  });
}

// Get order history
async function getOrderHistory(req, res) {
  const { userId } = req.body;

  pool.query(
    "SELECT * FROM orders WHERE user_id = ?",
    [userId],
    (error, orders) => {
      if (error) {
        throw error;
      }

      // Get order details for each order
      const orderIds = orders.map((order) => order.id);
      pool.query(
        "SELECT * FROM order_details WHERE order_id IN (?)",
        [orderIds],
        (error, orderDetails) => {
          if (error) {
            throw error;
          }

          res.status(200).json({ orders, orderDetails });
        }
      );
    }
  );
}

// Get order details by ID
async function getOrderById(req, res) {
  const orderId = req.params.orderId;

  pool.query(
    "SELECT * FROM orders WHERE id = ?",
    [orderId],
    (error, orders) => {
      if (error) {
        throw error;
      }

      // Get order details for the specified order ID
      pool.query(
        "SELECT * FROM order_details WHERE order_id = ?",
        [orderId],
        (error, orderDetails) => {
          if (error) {
            throw error;
          }

          res.status(200).json({ order: orders[0], orderDetails });
        }
      );
    }
  );
}

module.exports = { addOrder, getOrderById, getOrderHistory };
