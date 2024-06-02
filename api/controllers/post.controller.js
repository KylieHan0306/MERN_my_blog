const Post = require('../models/post.model.js');
const errorHandler = require('../utils/errorHandler.js');

const createPostController = async (req, res, next) => {
    if (!req.body.title || !req.body.content) {
        return next(errorHandler(400, 'Please provide all required fields'));
    }
    const slug = req.body.title.trim(' ').split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
    const newPost = new Post({
        ...req.body,
        slug,
        userId: req.user.id,
    });
    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        next(error);
    }
}

const getPostsController = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortOrder = req.query.order === 'asc'? 1: -1;
        const posts = await Post.find({
            ...(req.query.userId && {userId: req.query.userId}),
            ...(req.query.category && {category: req.query.category}),
            ...(req.query.slug && {slug: req.query.slug}),
            ...(req.query.postId && {_id: req.query.postId}),
            ...(req.query.searchTerm && {
                $or: [
                    {title: {$regex: req.query.searchTerm, $options:'i' }},
                    {content: {$regex: req.query.searchTerm, $options: 'i'}},
                    {code: {$regex: req.query.searchTerm, $options: 'i'}}
                ]
            })
        })
        .sort({ updateAt:sortOrder })
        .skip(startIndex)
        .limit(limit);

        const totalPosts = await Post.countDocuments();

        const now = new Date();
        const oneMonthAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        );
        const lastMonthPosts = await Post.countDocuments({
          createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({
            posts,
            totalPosts,
            lastMonthPosts,
        });

    } catch (e) {
        next(e);
    }
}

const deletePostController = async (req, res, next) => {
    // Only admin and the post's owner can delete the post
    if (!req.user.isAdmin && req.params.userId !== req.user.id) return next(errorHandler(403, 'You are not allowed to delete this post')); 
    try {
        await Post.findOneAndDelete({ _id: req.params.postId });
        res.status(200).json('Post deleted successfully');
    } catch(e) {
        next(e);
    }
}

const updatePostController = async (req, res, next) => {
    if (req.user.id !== req.params.userId) return next(errorHandler(403, 'You are not allowed to update this post'));
    try {
        if (req.body.title) req.body.slug = req.body.title.trim(' ').split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.postId,
            {
            $set: {
                title: req.body.title,
                content: req.body.content,
                category: req.body.category,
                code: req.body.code,
                image: req.body.image,
                slug: req.body.slug
            },
            },
            { new: true }
        );
        res.status(200).json(updatedPost);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPostController,
    getPostsController,
    deletePostController,
    updatePostController
}