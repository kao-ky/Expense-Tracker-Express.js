const mongoose = require('mongoose')

const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    endpoint: {
        type: String,
        required: true
    },
    _id: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Menu', menuSchema)
