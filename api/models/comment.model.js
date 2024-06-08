const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const commentSchema = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    postId: {
        type: String, 
        required: true 
    },
    userId: {
        type: String,
    },
    likes: {
        type: Array,
        default: []
    },
    parentId: {
        type: ObjectId
    }
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);
module.exports =  Comment;