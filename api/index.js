const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const userRouter = require('./routes/user.route.js')
const authRouter = require('./routes/auth.route.js')

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
app.use(express.json())
app.use('/api', userRouter)
app.use('/api/auth', authRouter)
app.use((err, req, res, next)=> {
    const statusCode = err.statusCode || 500
    const errMsg = err.message || "Internal server error"
    res.status(statusCode).json({
        errMsg
    })
})