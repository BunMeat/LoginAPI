//install bbrp hal
//npm install --save express morgan dotenv nodemon jsonwebtoken 
//http-errors mongoose @hapi/joi redis@3.0.2 npm install -g redis-commander
//untuk start, type npm start di terminal
//jangan lupa wsl --install dan redis-server di cmd
//redis-commander untuk jalanin redis commander
//main app

const express = require('express')
const morgan = require('morgan') 
const createError = require('http-errors')
const jwt = require('jsonwebtoken')
// const mongoose = require('mongoose')
require('dotenv').config()
require('./helpers/initMongoDB')
const authRoute = require('./routes/authRoute')
const { verifyAccessToken } = require('./helpers/jwtHelper')
require('./helpers/initRedis')

const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true})) //optional

const PORT = process.env.PORT || 3000

app.get('/', verifyAccessToken, async(req, res, next) => {
    
    res.send("Hello")
})

app.use('/auth', authRoute)

app.use(async(req, res, next) => {
    next(createError.NotFound()) 
})

app.use((err, req, res, next) => {
    res.status(err.status) || 500
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        },
    })
})

// connectDB().then(() => {
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
// })