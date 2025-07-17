
const express = require('express');
const { addNewUser } = require('./user.controller');


const userRouter = express.Router();


userRouter.post("/add-user", addNewUser)



module.exports = {userRouter};
