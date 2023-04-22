const mongoose = require('mongoose')
const { mongo } = require('../../util/mongo')
var monthlyProgressSchema = new mongoose.Schema({
    habitName: {
        type: String,
        required: true,
    },
    progress: {
        type: {},
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

exports.monthlyProgress = mongo.model('monthly-progress', monthlyProgressSchema, 'monthly-progress')