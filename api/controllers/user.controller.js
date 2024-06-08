const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const mongoose = require('mongoose')
const User = require('../models/user.model.js')
const sendEmail = require('../utils/sendEmail.js')
const errorHandler = require('../utils/errorHandler.js')
const { validPassword, validUsername, validEmail } = require('../utils/validation.js')

const deleteUserController = async (req, res, next) => {
    if (!req.user.isAdmin && req.user.id !== req.params.id) return next(errorHandler(403, 'You are not allowed to delete this user'))
    try {
        await User.findOneAndDelete(req.params.id)
        res.status(200).json('The user has been deleted')
    } catch (e) {
        next(e)
    }
}

const updateUserController = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, 'Unauthorized')); 
    if (req.body.username?.length === 0 || (req.body.username && !validUsername(req.body.username))) {
        next(errorHandler(400, "Username must be at most 20 characters long, and not contain spaces or special characters."));
        return
    }
    if (req.body.password?.length === 0 || (req.body.password && !validPassword(req.body.password))) {
        next(errorHandler(400, "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*(),.?\":{}|<>)."));
        return
    }
    if (req.body.email?.length === 0 || (req.body.email && !validEmail(req.body.email))) {
        next(errorHandler(400, "Email is not in a valid format."));
        return
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
              $set: {
                username: req.body.username,
                email: req.body.email,
                profilePicture: req.body.profilePicture,
                password: req.body.password && bcryptjs.hashSync(req.body.password, 10),
                photoUrl: req.body.photoUrl
              },
            },
            { new: true }
        );
        const { password, ...rest } = updatedUser._doc;
        if (req.body.email) {
            const email = req.body.email;
            const userId = req.params.id;
            const email_token = jwt.sign({ userId, email }, process.env.JWT_SECRET_KEY, {expiresIn: '1h'});
            const sendEmailRes = await sendEmail(email, email_token, 'change');
            if (sendEmailRes) {
                res.status(200).json({user: rest, message: 'Please verify your new email'});
                return;
            }
        }
        res.status(200).json({user: rest});
    } catch(e) {
        next(e);
    }
}

const changeEmailController = async (req, res, next) => {
    const token = req.body;
    if (!token) {
        next(errorHandler(400, "Invalid verification token."));
        return;
    }
    const decodedData = jwt.verify(token.token, process.env.JWT_SECRET_KEY);
    try {
        const user = await User.findOne({ _id: decodedData.userId });
        user.email = decodedData.email;
        await user.save();
        const {password, ...rest} = user._doc;
        res.status(200).json({ message: 'Your new email was verified!', user: rest });
    } catch(e) {
        next(e);
    }

}

const getUsersController = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(403, 'You are not allow to see all the users'));
    if (!req.user.isAdmin) return next(errorHandler(403, 'You are not allow to see all the users'));
    try {
        const startIndex = req.query.startIndex || 0;
        const order = req.query.order === 'asc'? 1:-1;
        const limit = req.query.limit || 9;
        const users = await User.find().sort({ createAt: order }).skip(startIndex).limit(limit);
        const usersWithoutPass = users.map((user) => {
            const {password, ...withoutPass} = user._doc;
            return withoutPass;
        })
        const now = new Date();
        const lastMonth = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )
        const usersCount = await User.countDocuments();
        const usersLastMonth = await User.countDocuments({ createdAt: {$gte: lastMonth} });

        res.status(200).json({usersCount, usersLastMonth, usersWithoutPass});
    } catch (error) {
        next(error)
    }
}

const getUserController = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if(!user) return next(errorHandler(404, 'User not found'));
        res.status(200).json(user);
    } catch(e) {
        next(e);
    }
}

module.exports = {
    deleteUserController,
    updateUserController,
    changeEmailController,
    getUsersController,
    getUserController
}
