const Expense = require('../models/Expense')
const PaymentMethod = require('../models/PaymentMethod')
const Currency = require('../models/Currency')
const logger = require('../utils/logger')

const getReport = async (req, res) => {

    const month = req.query.month ? parseInt(req.query.month) - 1 : getCurrMonth()

    const fromDate = getCustomReportDateStart( month ) 
    const toDate = getCustomReportDateEnd( month ) 

    var expenseList = []
    const currencyList = await Currency.find({})

    // barChart data
    for (const data of currencyList) {
        const allExpenses = await getAllExpenseList( fromDate, toDate, data.currency )
        logger.debug(`getReport() > allExpenses = allExpenses`)
        const expenseReportList = getExpenseReportList(allExpenses, month)
        const cnyExpenseObj = { currency: data.currency, expenses: JSON.stringify(expenseReportList) }
        expenseList.push(cnyExpenseObj)
    }
    
    // pieChart data
    const allPaymentMethods = await getAllPaymentMethods()
    const allPaymentMethodExpenses = await getAllPaymentExpenses(fromDate, toDate)
    var pieChartExpensesInOrder = []

    for (const method of allPaymentMethods) {
        pieChartExpensesInOrder.push( allPaymentMethodExpenses[method] )
    }
    
    // trx data
    const allTrxs = await getMonthlyExpenseList( fromDate, toDate ) 

    logger.debug(`getReport() > getAllPaymentMethods = ${allPaymentMethods}`)
    logger.debug(`getReport() > allPaymentMethodExpenses = ${JSON.stringify(allPaymentMethodExpenses)}`)
    logger.debug(`getReport() > pieChartExpensesInOrder = ${JSON.stringify(pieChartExpensesInOrder)}`)

    res.render('report', { month: monthNames[month], 
                            expenseList, dateData: getReportDateList(month), 
                            allPaymentMethods, pieChartExpensesInOrder,
                            allTrxs} )
}

const getExpensesByPaymentMethod = async (fromDate, toDate, method) => {
    return await Expense.aggregate([
        {
            $match: {
                trx_date: { $gte: fromDate, $lte: toDate },
                payment_method: method
            }
        },
        {
            $group: {
                _id: {
                    "$dateToString": {
                      "format": "%Y-%m-%d",
                      "date": "$trx_date"
                    }
                  },
                amount: { $sum: "$amount" },
            }
        },
        {
            $sort: {
                _id: 1
            }
        }
    ])
}

const getAllPaymentExpenses = async (fromDate, toDate) => {
    const allPaymentMethods = await getAllPaymentMethods()
    var allPaymentExpenses = {}
    var total

    for (const method of allPaymentMethods) {
        total = 0
        const allExpenses = await getExpensesByPaymentMethod(fromDate, toDate, method)
        allExpenses.forEach( data => {
            total += data.amount
        })
        allPaymentExpenses[method] = total
    }

    return allPaymentExpenses
}

const getAllPaymentMethods = async () => {
    const paymentMethodList = await PaymentMethod.find({}, {payment_method: 1, _id: 0})
    var allPaymentMethods = []

    for (const data of paymentMethodList) {
        allPaymentMethods.push(data.payment_method)
    }

    return allPaymentMethods
}

const getMonthlyExpenseList = async (fromDate, toDate) => {
    return await Expense.find({"trx_date": {$gte: fromDate, $lt: toDate} }).lean()
}

const getAllExpenseList = async (fromDate, toDate, cny) => {
    return await Expense.aggregate([
        {
            $match: {
                trx_date: { $gte: fromDate, $lte: toDate },
                currency: cny
            }
        },
        {
            $group: {
                _id: {
                    "$dateToString": {
                    "format": "%Y-%m-%d",
                    "date": "$trx_date"
                    }
                },
                amount: { $sum: "$amount" },
            }
        },
        {
            $sort: {
                _id: 1
            }
        }
    ])
}

const getReportDateList = (month) => {
    var arr = []
    var day = 0  // not showing later month

    if (getCurrMonth() != month && month < getCurrMonth()) {
        day = getTotalDaysOfMonth(month)
    } else if ( month == getCurrMonth() ) {
        day = getCurrDay()
    }
    
    for (var i = 0; i < day; i++) {
        arr[i] = i + 1
    }

    return arr
}

// This function returns list of expense from the start to current date of current month
const getExpenseReportList = (expenseList, month) => {
    var day = month == getCurrMonth() ? getCurrDay() : getTotalDaysOfMonth(month)
    var arrDates = Array(day).fill(0)
    
    expenseList.forEach( data => {
        const day = getDay(data._id)
        const dayToInt = parseInt(day)
        arrDates[dayToInt-1] = data.amount
    })

    return arrDates
}

const getTotalDaysOfMonth = (month) => {
    var date = getCustomReportDateEnd(month).toString()
    var day = getDay( date )
    return parseInt(day)
}

const getDay = (date) => {
    return date.slice(8,10)
}

const getCurrMonth = () => {
    const date = new Date()
    const month = parseInt( date.getMonth() )
    return month
}

const getCurrDay = () => {
    const date = new Date()
    return parseInt( getDay(date.toString()) ) 
}

const getCustomReportDateStart = (month) => {
    const date = new Date()
    const startDate = new Date(date.getFullYear(), month, 1)
    return startDate
}

const getCustomReportDateEnd = (month) => {
    const date = new Date()
    const endDate = new Date(date.getFullYear(), month + 1, 0)
    return endDate
}

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"]

module.exports = { getReport }