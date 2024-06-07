const express = require('express');
const verifyToken = require('../utils/verifyToken.js');
const { createCommentController, getCommentsController, likeCommentController, editCommentController, deleteCommentController, getAllCommentsController } = require('../controllers/comment.controller.js');

const commentRouter = express.Router();
commentRouter.post('/create', verifyToken, createCommentController);
commentRouter.get('/post/:postId', getCommentsController);
commentRouter.put('/like/:id', verifyToken , likeCommentController);
commentRouter.put('/update/:id', verifyToken , editCommentController);
commentRouter.delete('/delete/:id', verifyToken, deleteCommentController);
commentRouter.get('/all', verifyToken, getAllCommentsController);

module.exports = commentRouter;