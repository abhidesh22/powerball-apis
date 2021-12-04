const express = require('express')
const routes = require('./routes')
const parser = require('body-parser')
const { config } = require('dotenv')
const connectDB = require('../db.js')

// Create Express App
const app = express()
config()
connectDB()
app.use(parser.json())

// Routes
app.use('/', routes)

module.exports = app
