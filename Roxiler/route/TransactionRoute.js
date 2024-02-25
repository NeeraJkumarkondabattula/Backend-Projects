const express = require("express");
const connection = require("../config/DatabaseConnection");

const TransactionRouter = express.Router();

// API to list all transactions with search and pagination
TransactionRouter.get("/transactions", (req, res) => {
  const { page = 1, perPage = 10, search = "" } = req.query;
  const offset = (page - 1) * perPage;
  const limit = parseInt(perPage);

  let query = "SELECT * FROM transactions";
  let countQuery = "SELECT COUNT(*) AS totalCount FROM transactions";

  // Add search functionality
  if (search) {
    const searchTerm = `%${search}%`;
    query += ` WHERE title LIKE ? OR description LIKE ? OR price LIKE ?`;
    countQuery += ` WHERE title LIKE ? OR description LIKE ? OR price LIKE ?`;
    connection.query(
      query,
      [searchTerm, searchTerm, searchTerm, offset, limit],
      (err, results) => {
        if (err) {
          console.error("Error executing transaction search query:", err);
          res.status(500).json({
            error: "An error occurred while searching for transactions.",
          });
          return;
        }

        connection.query(
          countQuery,
          [searchTerm, searchTerm, searchTerm],
          (err, countResult) => {
            if (err) {
              console.error("Error executing transaction count query:", err);
              res.status(500).json({
                error: "An error occurred while counting transactions.",
              });
              return;
            }

            const totalCount = countResult[0].totalCount;
            res.json({ transactions: results, totalCount });
          }
        );
      }
    );
  } else {
    // If no search term provided, fetch all transactions with pagination
    query += ` LIMIT ?, ?`;
    connection.query(query, [offset, limit], (err, results) => {
      if (err) {
        console.error("Error executing transaction query:", err);
        res
          .status(500)
          .json({ error: "An error occurred while fetching transactions." });
        return;
      }

      // Get total count of transactions for pagination
      connection.query(
        "SELECT COUNT(*) AS totalCount FROM transactions",
        (err, countResult) => {
          if (err) {
            console.error("Error executing transaction count query:", err);
            res.status(500).json({
              error: "An error occurred while counting transactions.",
            });
            return;
          }

          const totalCount = countResult[0].totalCount;
          res.json({ transactions: results, totalCount });
        }
      );
    });
  }
});

// API for statistics
TransactionRouter.get("/statistics/:month", (req, res) => {
  const { month } = req.params;

  // Total sale amount of selected month
  const totalSaleQuery = `SELECT COALESCE(SUM(price), 0) AS totalSaleAmount FROM transactions WHERE MONTH(dateOfSale) = ?`;

  console.log("Executing total sale amount query:", totalSaleQuery);
  connection.query(totalSaleQuery, [month], (err, totalSaleResult) => {
    if (err) {
      console.error("Error executing total sale amount query:", err);
      return res.status(500).json({
        error: "An error occurred while calculating total sale amount.",
      });
    }

    const totalSaleAmount = totalSaleResult[0].totalSaleAmount;

    // Total number of sold items of selected month
    const soldItemsQuery = `SELECT COUNT(*) AS totalSoldItems FROM transactions WHERE MONTH(dateOfSale) = ?`;

    console.log("Executing total sold items query:", soldItemsQuery);
    connection.query(soldItemsQuery, [month], (err, soldItemsResult) => {
      if (err) {
        console.error("Error executing total sold items query:", err);
        return res.status(500).json({
          error: "An error occurred while calculating total sold items.",
        });
      }

      const totalSoldItems = soldItemsResult[0].totalSoldItems;

      // Total number of not sold items of selected month
      const unsoldItemsQuery = `SELECT COUNT(*) AS totalUnsoldItems FROM transactions WHERE MONTH(dateOfSale) = ? AND dateOfSale IS NULL`;

      console.log("Executing total unsold items query:", unsoldItemsQuery);
      connection.query(unsoldItemsQuery, [month], (err, unsoldItemsResult) => {
        if (err) {
          console.error("Error executing total unsold items query:", err);
          return res.status(500).json({
            error: "An error occurred while calculating total unsold items.",
          });
        }

        const totalUnsoldItems = unsoldItemsResult[0].totalUnsoldItems;

        res.json({
          month,
          totalSaleAmount,
          totalSoldItems,
          totalUnsoldItems,
        });
      });
    });
  });
});

TransactionRouter.get("/bar-chart/:month", (req, res) => {
  const { month } = req.params;

  // Log to verify the specified month
  console.log("Selected month:", month);

  // Define price ranges
  const priceRanges = [
    { min: 0, max: 100 },
    { min: 101, max: 200 },
    { min: 201, max: 300 },
    { min: 301, max: 400 },
    { min: 401, max: 500 },
    { min: 501, max: 600 },
    { min: 601, max: 700 },
    { min: 701, max: 800 },
    { min: 801, max: 900 },
    { min: 901, max: Number.MAX_SAFE_INTEGER },
  ];

  // Prepare an array to store the results for each price range
  const barChartData = [];

  // Loop through each price range and execute SQL query to count the number of items in that range for the selected month
  priceRanges.forEach((range) => {
    const { min, max } = range;

    const priceRangeQuery = `SELECT COUNT(*) AS count FROM transactions WHERE price >= ? AND price <= ? AND MONTH(dateOfSale) = ?`;

    // Log the SQL query to verify its correctness
    console.log("Price range query:", priceRangeQuery);

    connection.query(priceRangeQuery, [min, max, month], (err, result) => {
      if (err) {
        console.error("Error executing price range query:", err);
        return res
          .status(500)
          .json({ error: "An error occurred while fetching bar chart data." });
      }

      const count = result[0].count;

      // Log the count for each price range
      console.log(`Count for price range ${min}-${max}:`, count);

      barChartData.push({
        priceRange: `${min}-${max}`,
        count,
      });

      // Check if this is the last query, then send the response
      if (barChartData.length === priceRanges.length) {
        res.json(barChartData);
      }
    });
  });
});

TransactionRouter.get("/pie-chart/:month", (req, res) => {
  const { month } = req.params;

  // Log to verify the specified month
  console.log("Selected month:", month);

  // Define the SQL query to retrieve all columns for the selected month
  const categoryQuery = `
      SELECT *
      FROM transactions
      WHERE MONTH(dateOfSale) = ?
    `;

  // Execute the SQL query
  connection.query(categoryQuery, [month], (err, results) => {
    if (err) {
      console.error("Error executing category query:", err);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching pie chart data." });
    }

    // Extract distinct categories from the results
    const categories = [...new Set(results.map((row) => row.category))];

    // Calculate the count for each category
    const pieChartData = categories.map((category) => ({
      category,
      count: results.filter((row) => row.category === category).length,
    }));

    // Send the response
    res.json(pieChartData);
  });
});

module.exports = TransactionRouter;
