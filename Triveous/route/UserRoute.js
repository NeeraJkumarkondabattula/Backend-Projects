const express = require("express");
const { registerUser, loginUser } = require("../controller/UserController");
const UserRouter = express.Router();

UserRouter.post("/api/register", registerUser);
UserRouter.post("/api/login", loginUser);

module.exports = UserRouter;
