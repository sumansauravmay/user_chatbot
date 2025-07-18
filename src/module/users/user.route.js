const express = require("express");
const { addNewUser } = require("./controller/addNewUser");
const { loginUser } = require("./controller/loginUser");

const userRouter = express.Router();

userRouter.post("/add-user", addNewUser);
userRouter.post("/login", loginUser);

module.exports = { userRouter };
