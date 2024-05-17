const express = require('express')
const userController = require('../controllers/user.controller.js')

const userRouter = express.Router()

userRouter.get('/user', userController)

module.exports = userRouter