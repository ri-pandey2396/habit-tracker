const mongoose = require('mongoose')
const { mongo } = require('../../util/mongo')
var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
        // unique: true
    },
    password: {
        type: String,
        require: true,
    },
    mobile: {
        type: String,
        required: false,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    createdOn: {
        type: Date,
        required: true
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: false
    },
    lastModifiedOn: {
        type: Date,
        required: true
    },
    lastModifiedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: false
    }
})

module.exports.user = mongo.model('user', userSchema, 'user')