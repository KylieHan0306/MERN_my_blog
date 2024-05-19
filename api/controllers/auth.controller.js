const bcryptjs = require('bcryptjs')
const User = require('../models/user.model.js')
const errorHandler = require('../utils/errorHandler.js')
const jwt = require('jsonwebtoken')

const registerController = async (req, res, next) => {
    const { username, password, email } = req.body
    console.log(req.body)
    if (!username || username.length === 0) {
        next(errorHandler(400, "Username cannot be empty."))
        return
    }
    if (!password || password.length === 0) {
        next(errorHandler(400, "Password cannot be empty."))
        return
    }
    if (!email || email.length === 0) {
        next(errorHandler(400, "Email cannot be empty."))
        return
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

const loginController = async (req, res, next) => {
    const { email, password } = req.body
    if (!password || password.length === 0) {
        next(errorHandler(400, "Password cannot be empty."))
        return
    }
    if (!email || email.length === 0) {
        next(errorHandler(400, "Email cannot be empty."))
        return
    }
    try {
        const currUser = await User.findOne({ email })
        if (!currUser) {
            next(errorHandler(404, "Invalid email or password."))
            return
        }
        const validPassword = bcryptjs.compareSync(password, currUser.password)
        if (!validPassword) {
            next(errorHandler(404, "Invalid email or password."))
            return
        }
        const token = jwt.sign({id: currUser._id}, process.env.JWT_SECRET_KEY)
        const { password: hashedPassword, ...withOutPassword } = currUser._doc
        res
        .status(200)
        .cookie('token', token, {
            httpOnly: true,
        })
        .json(withOutPassword)
    } catch(e) {
        next(e)
    }

}
module.exports = {
    registerController,
    loginController
}