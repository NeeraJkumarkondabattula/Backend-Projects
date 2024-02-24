const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  // Extract the token from the request headers
  const token = req.headers["authorization"];

  // Check if token is present
  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }

  // Verify the token
  jwt.verify(token, "your_secret_key", (err, decodedToken) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    // If token is valid, attach the decoded payload to the request object
    req.userId = decodedToken.userId;
    next(); // Move to the next middleware or route handler
  });
}

module.exports = authenticateToken;
