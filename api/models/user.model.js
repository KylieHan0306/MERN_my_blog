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
    photoUrl: {
        type: String, 
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })

const User = mongoose.model('User', userSchema)
module.exports = User