const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const userRouter = require('./routes/user.route.js')
const authRouter = require('./routes/auth.route.js')
const postRouter = require('./routes/post.route.js')
const commentRouter = require('./routes/comment.route.js')
const cookieParser = require('cookie-parser')
const path = require('path')
const parentDir = path.dirname(__dirname)

dotenv.config()

mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log('db is connected')
})
.catch((err) => {
    console.log(err)
})

const app = express()

app.listen(3000, () => {
    console.log('app listen on port 3000')
})
app.use(cookieParser());
app.use(express.json())
app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/post', postRouter)
app.use('/api/comment', commentRouter)
app.use(express.static(path.join(parentDir, '/client/dist')))

app.get('*', (req, res) => {
    res.sendFile(path.join(parentDir, 'client', 'dist', 'index.html'));
})

app.use((err, req, res, next)=> {
    const statusCode = err.statusCode || 500
    const errMsg = err.message || "Internal server error"
    res.status(statusCode).json({
        errMsg
    })
})