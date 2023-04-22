require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes/routes')
const app = express()
const path = require('path')
const serveStatic = require('serve-static')
const { readDB, isConnected } = require('./util/mongo')
const jwt = require('jsonwebtoken')
const state = { isShutdown: false }
const cors = require('cors')

const DEBUG_DELAY = 2000
const READINESS_PROBE_DELAY = 2 * 2 * 1000

app.use(cors())

const dotenv = require('dotenv')
dotenv.config()

app.use(serveStatic(path.join(__dirname, 'public')))
app.use(serveStatic(path.join(__dirname, 'assets', 'images')))
app.use(express.static(path.join(__dirname, 'documentation')))
app.use(express.static(path.join(__dirname, 'ExportedFile')))

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
app.use(bodyParser.json({ limit: '50mb' }))

// app.use('/', async (req, res, next) => {
//     if (state.isShutdown || !isConnected()) {
//         console.info('HEALTH: NOT OK')
//         res.writeHead(500)
//         return res.end('Server Shutdown in progress')
//     }
//     next()
// })

app.get('/api/master/health', (req, res, next) => {
    return res.end('HEALTHY')
})

app.use(routes)

app.use(((req, res, next) => {
    res.setHeader('Cache-Control', "no-cache, no-store, must-revalidate")
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', 0)
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
}))

var server = app.listen(process.env.PORT, () => {
    console.log('Connected successfully on port ' + process.env.PORT)
})

process.on('SIGTERM', function () {
    console.info('Got SIGTERM. Graceful shutdown start', new Date().toISOString())
    state.isShutdown = true
    setTimeout(gracefulStop, READINESS_PROBE_DELAY + DEBUG_DELAY)
});

gracefulStop = () => {
    console.info('Server is shutting down...', new Date().toISOString())

    server.close(() => {
        console.log('Releasing redis, read, write db connections')
        readDB.close()
        writeDB.close()
        // cacheClient.disconnect()
        console.info('Successful graceful shutdown', new Date().toISOString())
        process.exit(0)
    })
}