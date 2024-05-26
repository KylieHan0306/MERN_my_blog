const express = require('express')
const { userController, deleteUserController }= require('../controllers/user.controller.js')

const userRouter = express.Router()

userRouter.get('/', userController)
userRouter.delete('/delete/:userId', deleteUserController)

module.exports = userRouter