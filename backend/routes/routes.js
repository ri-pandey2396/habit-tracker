const express = require('express');
const monthlyController = require('../controllers/monthlyTaskController')
const userController = require('../controllers/userController')
const authController = require('../controllers/authenticator')
const auth = require('../controllers/verifyToken')
const router = express.Router();


router.post('/api/master/authenticate/user', authController.authenticate)

router.post('/api/master/user/signup', userController.singUpUser)
router.post('/api/master/user/login', userController.loginUser)

router.post('/api/master/monthly/task/get', auth.verifyToken, monthlyController.fetchMonthlyTask)
router.post('/api/master/monthly/task/save', auth.verifyToken, monthlyController.saveMonthlyTask)

module.exports = router 
