const mongoose = require('mongoose')

const currencySchema = new mongoose.Schema({
    currency: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Currency', currencySchema)