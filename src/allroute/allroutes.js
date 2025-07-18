


const express = require('express');
const { userRouter } = require('../module/users/user.route');
const allRoutes = express.Router();

allRoutes.use('/auth', userRouter);





module.exports = { allRoutes };