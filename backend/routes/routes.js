const express = require('express');
const monthlyController = require('../controllers/monthlyTaskController')
const router = express.Router();

router.post('/api/monthly/task/get', monthlyController.fetchMonthlyTask)
router.post('/api/monthly/task/save', monthlyController.saveMonthlyTask)

module.exports = router 
