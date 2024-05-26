const express = require('express')
const { registerController, loginController, emailVerifyController, resetRequestController, passwordResetController, resendEmailController, googleController, logoutController } = require('../controllers/auth.controller.js')

const authRouter = express.Router()

authRouter.post('/register', registerController)
authRouter.post('/login', loginController)
authRouter.post('/verify', emailVerifyController)
authRouter.post('/request-reset-password', resetRequestController)
authRouter.post('/reset-password', passwordResetController)
authRouter.post('/resend', resendEmailController)
authRouter.post('/google', googleController)
authRouter.get('/logout', logoutController)

module.exports = authRouter