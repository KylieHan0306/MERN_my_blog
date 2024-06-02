const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: {
        type: String, 
        require: true, 
        unique: true
    },
    content: {
        type: String, 
        require: true
    },
    photoUrl: {
        type: String, 
        default: 'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png'
    },
    category: {
        type: String,
        default: 'javascript',
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
    code: {
        type: String
    }
}, { timestamps: true })

const Post = mongoose.model('Post', postSchema)
module.exports = Post