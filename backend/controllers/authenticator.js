const jwt = require('jsonwebtoken');
const ApiResponse = require('../models/apiResponse')
const { user } = require('../models/mongoSchema/user')

exports.authenticate = async (req, res, next) => {
    const Response = new ApiResponse()
    Response.setInput(req.body)
    Response.setTag('/api/master/user/signup')
    try {
        if (req.body._id === '' || !req.body._id) {
            Response.setStatus(2)
            Response.setResult(null)
            Response.setDescription('Cannot find _id')
            return res.send(Response)
        }

        const auth = await user.findById(req.body._id).select('email').lean()

        if (!auth) {
            Response.setStatus(2)
            Response.setResult(null)
            Response.setDescription('Cannot find valid user')
            return res.send(Response)
        }

        const token = jwt.sign({
            user: auth
        }, 'kalajadu', { expiresIn: '1h' })

        Response.setStatus(1)
        Response.setResult(token)
        Response.setDescription('Created Authentication Token')
        return res.send(Response)
    } catch (err) {
        console.log(err)
        Response.setStatus(0)
        Response.setResult(null)
        Response.setDescription(err.message)
        return res.send(Response)
    }
}