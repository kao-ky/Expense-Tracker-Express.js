const mongoose = require('mongoose')
const paymentMethodSchema = require('./PaymentMethod')
// const AutoIncrement = require('mongoose-sequence')(mongoose)

const expenseSchema = new mongoose.Schema({
    trx_date: {
        type: Date,
        required: true
    },
    trx_desc: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }, 
    payment_method: {
        type: String,
        required: true
    },
    // payment_method: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'paymentMethodSchema',
    //     required: true
    // },
    to_currency: String,
    to_currency_amount: Number,
    // shared_by: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'userSchema'
    // },
    remark: String,
    // total: {
    //     type: Number,
    //     required: true
    // },
    update_date: {
        type: Date,
        default: Date.now
    }
})

// expenseSchema.plugin(AutoIncrement);

module.exports = mongoose.model('Expense', expenseSchema)