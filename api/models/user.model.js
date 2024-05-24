const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true 
    },
    email: {
        type: String,
        require: true,
        unique: true 
    },
    password: {
        type: String,
        require: true,
    },
    activate: {
        type: Boolean,
        default: false,
        require: true
    },
})

const User = mongoose.model('User', userSchema)
module.exports = User