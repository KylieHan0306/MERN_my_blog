const errorHandler = require('../utils/errorHandler.js');
const Comment = require('../models/comment.model.js');

const createCommentController = async (req, res, next) => {
    try {
        const { content, userId, postId } = req.body;
        if (userId !== req.user.id) return next(errorHandler(401, 'Unauthorized'));
        const comment = new Comment({
            content,
            userId, 
            postId
        })
        await comment.save();
        res.status(201).json(comment);
    } catch (error) {
        next(error);
    }
}

const getCommentsController = async (req, res, next) => {
    try {
        if (!req.params.postId) return next(errorHandler(500, 'Internal server error'));
        const comments = await Comment.find({ postId: req.params.postId}).sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const likeCommentController = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if(!comment) return next(errorHandler(404, 'Comment not found'));
        const userIndex = comment.likes.indexOf(req.user.id);
        if (userIndex === -1) {
            comment.likes.push(req.user.id);
        } else {
            comment.likes.splice(userIndex, 1);
        }
        await comment.save()
        res.status(200).json(comment)
    } catch (e) {
        next(e);
    }
}

const editCommentController = async (req, res, next) => {
    try {
        if(req.body.userId !== req.user.id) return next(errorHandler(403, 'You are not allowed to delete this comment'));
        const comment = await Comment.findByIdAndUpdate(req.params.id, {content: req.body.content}, {new: true})
        if (!comment) return next(errorHandler(404, 'Comment not found'));
        res.status(200).json(comment)
    } catch (e) {
        next(e);
    }
}

module.exports = {
    createCommentController,
    getCommentsController,
    likeCommentController,
    editCommentController
}