const express = require('express')
const { deleteUserController, updateUserController, changeEmailController, getUsersController, getUserController }= require('../controllers/user.controller.js')
const verifyToken = require('../utils/verifyToken.js')

const userRouter = express.Router()
userRouter.get('/getuser/:userId', getUserController)
userRouter.post('/email-update', changeEmailController)
userRouter.get('/:id', verifyToken, getUsersController)
userRouter.delete('/:id', verifyToken, deleteUserController)
userRouter.put('/:id', verifyToken, updateUserController)

module.exports = userRouter