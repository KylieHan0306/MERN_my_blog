const bcryptjs = require('bcryptjs')
const User = require('../models/user.model.js')
const errorHandler = require('../utils/errorHandler.js')
const jwt = require('jsonwebtoken')
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Function to send email
async function sendEmail(email, token) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.APP_PASS
        }
    });
    const verificationUrl = `http://localhost:3000/verify?token=${token}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Email Verification',
        html: `
            <h1>Verify Your Email</h1>
            <p>Thank you for registering. Please verify your email by clicking the link below:</p>
            <a href="${verificationUrl}">Verify Email</a>
        `,
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.error('Error sending email', error);
        }
        console.log('Email sent: ' + info.response);
    });
}

const registerController = async (req, res, next) => {
    const { username, password, email } = req.body

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
        const email_token = crypto.randomBytes(32).toString('hex')
        /* const newUser = new User({
            username,
            email,
            password: bcryptjs.hashSync(password, 10),
            email_token,
        }) */
        sendEmail(email, email_token)
        //await newUser.save()
        //sendVerificationEmail(email, email_token)
        //cookie needed for register
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