const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const userRouter = require('./routes/user.route.js')

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

app.use('/api', userRouter)