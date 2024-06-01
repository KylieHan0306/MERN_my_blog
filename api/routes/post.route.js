const express = require('express')
const verifyToken = require('../utils/verifyToken.js')
const { createPostController, getPostsController, deletePostController, updatePostController } = require('../controllers/post.controller.js')

const postRouter = express.Router()
postRouter.post('/create', verifyToken, createPostController)
postRouter.get('/', getPostsController)
postRouter.delete('/delete/:userId/:postId', verifyToken, deletePostController)
postRouter.put('/update/:userId/:postId', verifyToken, updatePostController)

module.exports = postRouter