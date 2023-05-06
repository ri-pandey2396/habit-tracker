const express = require('express');
const monthlyController = require('../controllers/monthlyTaskController')
const userController = require('../controllers/userController')
const router = express.Router();

router.post('/api/master/monthly/task/get', monthlyController.fetchMonthlyTask)
router.post('/api/master/monthly/task/save', monthlyController.saveMonthlyTask)
router.post('/api/master/user/signup', userController.singUpUser)
router.post('/api/master/user/login', userController.loginUser)

module.exports = router 
