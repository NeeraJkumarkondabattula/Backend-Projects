const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const pool = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

pool.connect((err) => {
  if (err) {
    console.log(
      "Error while Connecting Database!" + JSON.stringify(err, undefined, 2)
    );
  } else {
    console.log("Database connection successfull.");
  }
});

module.exports = pool;
