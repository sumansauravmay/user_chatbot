
const express = require('express');
const { addNewUser } = require('./controller/addNewUser');


const userRouter = express.Router();


userRouter.post("/add-user", addNewUser)



module.exports = {userRouter};
