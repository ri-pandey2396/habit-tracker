const mongoose = require('mongoose')
require('dotenv').config()

module.exports.mongo = mongoose.createConnection(process.env.MONGO__DB, { useUnifiedTopology: true, useNewUrlParser: true }, () => {
    console.log('Connected to Read DB')
})

module.exports.isConnected = () => {
    return module.exports.mongo.readyState === 1
}