const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
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
        default: "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User