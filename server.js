const express = require('express')
global.config = require('./configs/config')
var path = require('path')

const app = express()

const dbConnect = require('./configs/database')
const viewEngineSetup = require('./configs/viewEngine')
global.logger = require('./utils/logger')

const addMenu = require('./addMenu')

const menuController = require('./controllers/menuController')
const reportController = require('./controllers/reportController')

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist/")));

app.all('/', (req, res) => {
    res.render('index')
})

app.use('/menu', menuController)

app.get('/report', reportController)

app.use((req, res) => {
    logger.error(`Endpoint '${req.url}' does not exist.`)
    res.sendStatus(404)
})

app.listen(config.app.port, () => {
    dbConnect()
    viewEngineSetup(app)
    addMenu()
    logger.info(`Server is running on Port ${config.app.port}. Press Ctrl+C to exit.`)
})