const express = require('express')
const { registerController, loginController, emailVerifyController } = require('../controllers/auth.controller.js')

const authRouter = express.Router()

authRouter.post('/register', registerController)
authRouter.post('/login', loginController)
authRouter.get('/verify', emailVerifyController)

module.exports = authRouter