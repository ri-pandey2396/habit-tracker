const { user } = require('../models/mongoSchema/user')
const ApiResponse = require('../models/apiResponse')
const crypto = require('crypto');

exports.singUpUser = async (req, res, next) => {
    const Response = new ApiResponse()
    Response.setInput(req.body)
    Response.setTag('/api/master/user/signup')
    try {
        if (!req.body.signup.email || req.body.signup.email === '') {
            Response.setStatus(2)
            Response.setResult(null)
            Response.setDescription('Invalid Email')
            return res.send(Response)
        }
        if (!req.body.signup.password || req.body.signup.password === '') {
            Response.setStatus(2)
            Response.setResult(null)
            Response.setDescription('Invalid Password')
            return res.send(Response)
        }
        if (!req.body.signup.confirmPassword || req.body.signup.confirmPassword === '') {
            Response.setStatus(2)
            Response.setResult(null)
            Response.setDescription('Invalid Confirm Password')
            return res.send(Response)
        }
        if (req.body.signup.password !== req.body.signup.confirmPassword) {
            Response.setStatus(2)
            Response.setResult(null)
            Response.setDescription('Password does not match')
            return res.send(Response)
        }

        const password = securePassword(req.body.signup.password)

        const newUser = new user({
            email: req.body.signup.email,
            password,
            createdOn: new Date(),
            lastModifiedOn: new Date()
        })

        await newUser.save()

        if (newUser) {
            Response.setStatus(1)
            Response.setResult(null)
            Response.setDescription('Successfully Signed up')
        } else {
            Response.setStatus(2)
            Response.setResult(null)
            Response.setDescription('User Not Created Successfully')
        }

        return res.send(Response)

    } catch (error) {
        console.log(error)
        Response.setStatus(0)
        Response.setResult(null)
        Response.setDescription(error.message)
        return res.send(Response)
    }
}

const securePassword = (password) => {
    try {
        return crypto.createHash('sha256').update(password, 'base64').digest('hex')
    } catch (err) {
        console.log(err.message)
    }
}

exports.loginUser = async (req, res, next) => {
    const Response = new ApiResponse()
    Response.setInput(req.body)
    Response.setTag('/api/master/user/login')
    try {
        if (!req.body.login.email || req.body.login.email === '') {
            Response.setStatus(2)
            Response.setResult(null)
            Response.setDescription('Invalid Email')
            return res.send(Response)
        }
        if (!req.body.login.password || req.body.login.password === '') {
            Response.setStatus(2)
            Response.setResult(null)
            Response.setDescription('Invalid Password')
            return res.send(Response)
        }

        const password = securePassword(req.body.login.password)

        if (password) {
            const login = await user.findOne({ email: req.body.login.email, password }).lean()

            if (login) {
                Response.setStatus(1)
                Response.setResult(null)
                Response.setDescription('Successfully Logged In')
            } else {
                Response.setStatus(2)
                Response.setResult(null)
                Response.setDescription('Invalid email/password')
            }

            return res.send(Response)
        }
    } catch (err) {
        console.log(err)
        Response.setStatus(0)
        Response.setResult(null)
        Response.setDescription(err.message)
        return res.send(Response)
    }
}