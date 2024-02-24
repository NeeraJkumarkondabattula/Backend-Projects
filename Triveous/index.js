const bodyParser = require("body-parser");
const connection = require("./config/MySql");
const express = require("express");
const authenticateToken = require("./middleware/AuthMiddleware");
const UserRouter = require("./route/UserRoute");
const OrderRouter = require("./route/OrderRoute");
const CartRouter = require("./route/CartRoute");
const ProductRouter = require("./route/ProductRoute");

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded());
app.use(express.json());

app.use("/", UserRouter);
app.use("/", CartRouter);
app.use("/", OrderRouter);
app.use("/", ProductRouter);

app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log("ERROR While creating server");
  }
  console.log("Server created successfull Running on : " + process.env.PORT);
});
