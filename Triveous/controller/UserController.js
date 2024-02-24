const pool = require("../config/MySql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// User Registration
async function registerUser(req, res) {
  const { username, email, password } = req.body;

  // Check if username or email already exists
  pool.query(
    "SELECT * FROM users WHERE username = ? OR email = ?",
    [username, email],
    async (error, results) => {
      if (error) {
        throw error;
      } else if (results.length > 0) {
        // Username or email already exists
        res.status(409).json({ error: "Username or email already exists" });
      } else {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the user into the database
        pool.query(
          "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
          [username, email, hashedPassword],
          (error, results) => {
            if (error) {
              throw error;
            }
            res.status(201).json({ message: "User registered successfully" });
          }
        );
      }
    }
  );
}

// User Login
async function loginUser(req, res) {
  const { username, password } = req.body;

  // Check if the user exists
  pool.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (error, results) => {
      if (error) {
        throw error;
      } else if (results.length === 0) {
        // User not found
        res.status(401).json({ error: "Invalid username or password" });
      } else {
        // Compare password
        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          // Passwords don't match
          res.status(401).json({ error: "Invalid username or password" });
        } else {
          // Passwords match, generate token
          const token = jwt.sign({ userId: user.id }, "your_secret_key", {
            expiresIn: "1h",
          });

          // Send token to the client
          res.json({ token });
        }
      }
    }
  );
}

module.exports = { registerUser, loginUser };
