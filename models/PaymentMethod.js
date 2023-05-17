const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const paymentMethodSchema = new mongoose.Schema({
    payment_method: {
        type: String,
        required: true
    }
})

paymentMethodSchema.plugin(AutoIncrement, {inc_field: 'id'});

module.exports = mongoose.model('PaymentType', paymentMethodSchema)