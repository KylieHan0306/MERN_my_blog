const errorHandler = require('../utils/errorHandler.js');
const Comment = require('../models/comment.model.js');
const { ObjectId } = require('mongodb');

const createCommentController = async (req, res, next) => {
    try {
        const { content, userId, postId, parentId } = req.body;
        if (userId !== req.user.id) return next(errorHandler(401, 'Unauthorized'));
        let parentObjectId = null;

        if (parentId && ObjectId.isValid(parentId)) {
            parentObjectId = new ObjectId(parentId);
        }
        const comment = new Comment({
            content,
            userId, 
            postId,
            parentId: parentObjectId,
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
        const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (error) {
        next(error);
    }
}

const getAllCommentsController = async (req, res, next) => {
    if (!req.user.isAdmin) return next(errorHandler(403, 'You are not allowed to delete this comment'));
    try {
        const startIndex = req.query.startIndex || 0;
        const limit = req.query.limit || 9;
        const order = req.query.order === 'asc'? 1: -1;

        const comments = await Comment.find().sort({ updateAt: order }).skip(startIndex).limit(limit);
        const now = new Date();
        const lastMonth = new Date(
            now.getFullYear(),
            now.getMonth() -1,
            now.getDate()
        );
        const commentsCount = await Comment.countDocuments();
        const commentsLastCount = await Comment.find({ updateAt: { $gte: lastMonth }});
        res.status(200).json({comments, commentsCount, commentsLastCount})
    } catch (e) {
        next(e);
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
        if(req.body.userId !== req.user.id) return next(errorHandler(403, 'You are not allowed to edit this comment'));
        const comment = await Comment.findByIdAndUpdate(req.params.id, {content: req.body.content}, {new: true})
        if (!comment) return next(errorHandler(404, 'Comment not found'));
        res.status(200).json(comment)
    } catch (e) {
        next(e);
    }
}

const deleteCommentController = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return next(errorHandler(404, 'Comment not found'));
        if (comment.userId !== req.user.id && !req.user.isAdmin) return next(errorHandler(403, 'You are not allowed to delete this comment'));

        // Use aggregation to find all nested comments that are children of the comment to be deleted
        const commentsToDelete = await Comment.aggregate([
            {
                $match: {
                    _id: comment._id,
                },
            },
            {
                $graphLookup: {
                    from: 'comments', // Name of the collection
                    startWith: '$_id',
                    connectFromField: '_id',
                    connectToField: 'parentId',
                    as: 'descendants',
                },
            },
            {
                $project: {
                    allComments: {
                        $concatArrays: [['$_id'], '$descendants._id'],
                    },
                },
            },
        ]);

        // Extract all comment IDs to delete
        const commentIdsToDelete = commentsToDelete.length > 0 ? commentsToDelete[0].allComments : [];
        if (commentIdsToDelete.length === 0)  return next(errorHandler(404, 'No comments found to delete'));

        // Perform a single delete operation with all comment IDs
        await Comment.deleteMany({ _id: { $in: commentIdsToDelete } });
        res.status(200).json('Comments have been deleted');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCommentController,
    getCommentsController,
    likeCommentController,
    editCommentController,
    deleteCommentController,
    getAllCommentsController
}