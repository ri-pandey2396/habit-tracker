const { monthlyProgress } = require('../models/mongoSchema/taskProgress')
const { monthlyTasks } = require('../models/mongoSchema/taskSchema')
const ApiResponse = require('../models/apiResponse')

exports.fetchMonthlyTask = async (req, res, next) => {
    const Response = new ApiResponse()
    Response.setInput(req.body)
    Response.setTag('/api/monthly/task/get')
    try {
        if (!req.body.monthYear || req.body.monthYear === '') {
            Response.setStatus(2)
            Response.setResult({ habits, progress })
            Response.setDescription('Select Month to See or Create New Habit')
            return res.send(Response)
        }
        const habits = await monthlyTasks.findOne({
            month: getMonthInAlphabets(new Date(req.body.monthYear).getMonth()),
            year: parseInt(req.body.monthYear.split('-')[0])
        }).lean()

        let progress = null
        if (habits) {
            progress = await monthlyProgress.find({ parentTaskTrack: habits._id }).lean()
        }
        Response.setStatus(1)
        Response.setResult({ habits, progress })
        Response.setDescription('Successfully Found Record!')
        return res.send(Response)
    } catch (err) {
        console.log(err.message)
        Response.setStatus(0)
        Response.setResult({ habits, progress })
        Response.setDescription(err.message)
        return res.send(Response)
    }
}

const getMonthInAlphabets = (mon) => {
    const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return month[mon]
}

exports.saveMonthlyTask = async (req, res, next) => {
    const Response = new ApiResponse()
    Response.setInput(req.body)
    Response.setTag('/api/monthly/task/save')
    try {
        if (req.body.taskInfo._id !== '') {
            await monthlyTasks.findByIdAndUpdate(req.body.taskInfo._id, {
                selectedTheme: req.body.taskInfo.selectedTheme,
                goals: req.body.taskInfo.goals,
                notes: req.body.taskInfo.notes,
                lastModifiedOn: new Date()
            })
            if (req.body.progress.length > 0) {
                for (let i = 0; i < req.body.progress.length; i++) {
                    if (req.body.progress[i]._id !== '') {
                        await monthlyProgress.findByIdAndUpdate(req.body.progress[i]._id, {
                            habitName: req.body.progress[i][`habitName${i}`],
                            progress: req.body.progress[i].progress,
                            lastModifiedOn: new Date()
                        }, { new: true })
                    } else {
                        const task = new monthlyProgress({
                            habitName: req.body.progress[i][`habitName${i}`],
                            progress: req.body.progress[i].progress,
                            lastModifiedOn: new Date(),
                            createdOn: new Date()
                        })
                        await task.save()
                        if (task) {
                            progressIDs.push(task._id)
                        }
                    }
                }
            }
        } else {
            let progressIDs = []
            const mnth = getMonthInAlphabets(new Date(req.body.taskInfo.monthYear).getMonth())
            const monthHabit = new monthlyTasks({
                month: mnth,
                year: parseInt(req.body.taskInfo.monthYear.split('-')[0]),
                selectedTheme: req.body.taskInfo.selectedTheme,
                goals: req.body.taskInfo.goals,
                notes: req.body.taskInfo.notes,
                createdOn: new Date(),
                lastModifiedOn: new Date()
            })

            await monthHabit.save()

            if (req.body.progress.length > 0) {

                for (let i = 0; i < req.body.progress.length; i++) {
                    const task = new monthlyProgress({
                        habitName: req.body.progress[i][`habitName${i}`],
                        progress: req.body.progress[i].progress,
                        parentTaskTrack: monthHabit._id,
                        lastModifiedOn: new Date(),
                        createdOn: new Date()
                    })
                    await task.save()
                    if (task) {
                        progressIDs.push(task._id)
                    }
                }
            }
        }
        Response.setStatus(1)
        Response.setResult({ habits, progress })
        Response.setDescription('Successfully Saved Habit Record!')
        return res.send(Response)
    } catch (err) {
        console.log('Task Saving Err:', err)
        Response.setStatus(0)
        Response.setResult(null)
        Response.setDescription(err.message)
        return res.send(Response)
    }
}