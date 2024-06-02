const express = require('express');
const verifyToken = require('../utils/verifyToken.js');
const { createCommentController, getCommentsController, likeCommentController, editCommentController } = require('../controllers/comment.controller.js');

const commentRouter = express.Router();
commentRouter.post('/create', verifyToken, createCommentController);
commentRouter.get('/:postId', getCommentsController);
commentRouter.put('/like/:id', verifyToken , likeCommentController)
commentRouter.put('/update/:id', verifyToken , editCommentController)

module.exports = commentRouter;