const bcryptjs = require('bcryptjs')
const User = require('../models/user.model.js')
const errorHandler = require('../utils/errorHandler.js')

const authController = async (req, res, next) => {
    const { username, password, email } = req.body
    console.log(req.body)
    if (!username || username.length === 0) {
        next(errorHandler(400, "Invalid username"))
    }
    if (!password || password.length === 0) {
        next(errorHandler(400, "Invalid password"))
    }
    if (!email || email.length === 0) {
        next(errorHandler(400, "Invalid email"))
    }

    try {
        const newUser = new User({
            username,
            email,
            password: bcryptjs.hashSync(password, 10)
        }) 
        await newUser.save()
        res.status(201).json(req.body)
    } catch (e) {
        next(e)
    }
}

module.exports = authController