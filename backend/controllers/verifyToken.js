const jwt = require('jsonwebtoken');
const ApiResponse = require('../models/apiResponse')

exports.verifyToken = async (req, res, next) => {
    const Response = new ApiResponse()
    Response.setInput(req.body)
    Response.setTag('/api/master/user/signup')
    try {
        if (req['headers'].authorization === '' || !req['headers'].authorization) {
            Response.setStatus(2)
            Response.setResult(null)
            Response.setDescription('Auth Token Not found!')
            return res.send(Response)
        }

        const verify = jwt.verify(req['headers'].authorization.split(' ')[1], 'kalajadu')

        if (verify) {
            req.body.authorisedUser = verify.user
            next()
        } else {
            Response.setStatus(2)
            Response.setResult(null)
            Response.setDescription('Auth Token Not found!')
            return res.send(Response)
        }
    } catch (err) {
        console.log(err)
        Response.setStatus(2)
        Response.setResult(null)
        Response.setDescription(err.message)
        return res.send(Response)
    }
}