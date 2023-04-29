const mongoose = require('mongoose')
const { mongo } = require('../../util/mongo')
var monthlyTasksSchema = new mongoose.Schema({
    // habit: [{
    //     type: mongoose.Types.ObjectId,
    //     ref: 'monthly-progress',
    //     required: true
    // }],
    selectedTheme: {
        type: String,
        required: true
    },
    goals: {
        type: String,
        required: false
    },
    month: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    notes: {
        type: String,
        required: false
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

module.exports.monthlyTasks = mongo.model('monthly-task', monthlyTasksSchema, 'monthly-task')