const mongoose = require('mongoose')
const { mongo } = require('../../util/mongo')
var monthlyTasksSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        require: true
    },
    mobile: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        required: true
    },

    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    lastModifiedOn: {
        type: Date,
        required: true
    },
    lastModifiedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    }
})

exports.monthlyTasks = mongo.model('user', monthlyTasksSchema, 'user')