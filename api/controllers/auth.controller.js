const bcryptjs = require('bcryptjs')
const User = require('../models/user.model.js')
const errorHandler = require('../utils/errorHandler.js')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

async function sendVerificationEmail(email, token) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.APP_PASS
        }
    });
    const verificationUrl = `${process.env.SERVER_URL}/api/auth/verify?token=${token}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Email Verification',
        html: `
            <h1>Verify Your Email</h1>
            <p>Thank you for registering. Please verify your email by clicking the link below:</p>
            <a href="${verificationUrl}">Verify Email Here</a>
        `,
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            next(errorHandler(500, "Internal server error when sending email"));
        }
        res.status(200).send('Email sent: ' + info.response);
    });
}

const registerController = async (req, res, next) => {
    const { username, password, email } = req.body;

    if (!username || username.length === 0) {
        next(errorHandler(400, "Username cannot be empty."));
        return
    }
    if (!password || password.length === 0) {
        next(errorHandler(400, "Password cannot be empty."));
        return
    }
    if (!email || email.length === 0) {
        next(errorHandler(400, "Email cannot be empty."));
        return
    }

    try {
        const email_token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        const newUser = new User({
            username,
            email,
            password: bcryptjs.hashSync(password, 10),
        })
        await newUser.save();
        sendVerificationEmail(email, email_token);
        res.status(201).json({message: 'Register successed, please verify your email'});
    } catch (e) {
        next(e);
    }
}

const loginController = async (req, res, next) => {
    const { email, password } = req.body;
    if (!password || password.length === 0) {
        next(errorHandler(400, "Password cannot be empty."));
        return;
    }
    if (!email || email.length === 0) {
        next(errorHandler(400, "Email cannot be empty."));
        return;
    }
    try {
        const currUser = await User.findOne({ email });
        if(currUser.activate === false) {
            next(errorHandler(403, "Please verify your email first"));
            return
        }
        if (!currUser) {
            next(errorHandler(404, "Invalid email or password."));
            return
        }
        const validPassword = bcryptjs.compareSync(password, currUser.password);
        if (!validPassword) {
            next(errorHandler(404, "Invalid email or password."));
            return;
        }
        const token = jwt.sign({id: currUser._id}, process.env.JWT_SECRET_KEY);
        const { password: hashedPassword, ...withOutPassword } = currUser._doc;
        res
        .status(200)
        .cookie('token', token, {
            httpOnly: true,
        })
        .json(withOutPassword)
    } catch(e) {
        next(e);
    }

}

const emailVerifyController = async (req, res) => {
    try {
        const token = req.query.token;
        const decodedEmail = jwt.verify(token, process.env.JWT_SECRET_KEY).email;
        const user = await User.findOne({ email: decodedEmail });
        if (!user) {
            next(errorHandler(400, "Invalid verification token"));
            return;
        }
        // Activate email
        user.activate = true;
        await user.save();
        // Assuming successful verification, redirect to a success page
        res.status(200).json({ message: 'Verification successful!, you can login to your account now' });
    } catch (e) {
        if (e.name === 'TokenExpiredError') {
            next(errorHandler(400, "Your verification token has expired."));
            return;
        }
        next(errorHandler(500, "Server error during verification."));
        return;
    }
}

module.exports = {
    registerController,
    loginController,
    emailVerifyController
}