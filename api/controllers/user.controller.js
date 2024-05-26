const User = require('../models/user.model.js')

const userController = (req, res) => {
    res.json({message: 'user router is on'})
}

const deleteUserController = async (req, res, next) => {
    try {
        await User.findOneAndDelete(req.params.userId)
        res.status(200).json('Your account has been deleted')
    } catch (e) {
        next(e)
    }
}

module.exports = {
    userController,
    deleteUserController
}
