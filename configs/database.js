const mongoose = require('mongoose')
const logger = require('../utils/logger')

mongoose.set('strictQuery', true)

const URL = `mongodb+srv://root:admin@cluster0.idhobwd.mongodb.net/${config.app.name}`

const connect = async () => {
    try {
        await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        logger.info('Database connected.')
    } catch (e) {
        logger.error(`Database connection cannot be established: ${e}`)
    }
}

module.exports = connect