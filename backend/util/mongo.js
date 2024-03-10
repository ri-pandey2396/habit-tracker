const mongoose = require('mongoose')
require('dotenv').config()

module.exports.mongo = mongoose.createConnection(process.env.MONGO__DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}, (err, client) => {
    // client.db('trackerDev')
    console.log('Connected to Read DB', process.env.MONGO__DB)
})
// MongoClient.connect(
//     url,
//     {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     },
//     (err, client) => {
//       if (err) {
//         return console.log(err)
//       }

//       // Specify the database you want to access

//       console.log(`MongoDB Connected: ${url}`)
//     }
//   )
module.exports.isConnected = () => {
    return module.exports.mongo.readyState === 1
}