const express = require('express')
const { userController, deleteUserController, updateUserController, changeEmailController }= require('../controllers/user.controller.js')
const verifyToken = require('../utils/verifyToken.js')

const userRouter = express.Router()

userRouter.get('/', userController)
userRouter.delete('/:id', verifyToken, deleteUserController)
userRouter.put('/:id', verifyToken, updateUserController)
userRouter.post('/email-update', changeEmailController)

module.exports = userRouter