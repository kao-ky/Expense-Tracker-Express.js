const Expense = require('../models/Expense')
const Menu = require('../models/MenuFunction')
const PaymentMethod = require('../models/PaymentMethod')
const {FILE_TYPE, convertToXlsxFile} = require('./fileConvertServices')


const addTrx = async (req, res) => {
    const trx_date = req.body.trxDate
    const trx_desc = req.body.trxDesc
    const currency = req.body.currency
    const amount = req.body.amount
    const payment_method = req.body.paymentMethod
    const remark = req.body.remark ? req.body.remark : undefined

    const trx = new Expense({
        trx_date,
        trx_desc,
        currency,
        amount,
        payment_method,
        remark
    })

    try {
        await trx.save()
        logger.info(`Transaction saved:\n${trx}`)
        res.render('add-expense')
    } catch (err) {
        logger.error(err)
    }
}

const getAddExpensePage = async (req, res) => {
    const mode = req.query.mode === "custom"

    if (!mode) {
        res.render('add-expense')
        return
    }

    try {
        const currencyList = await Currency.find()
        const paymentMethodList = await PaymentMethod.find()
        logger.debug(`Values of currencyList: ${currencyList}.`)
        logger.debug(`Values of paymentMethodList: ${paymentMethodList}.`)
        res.render('add-expense', { customMode: mode, currenyList, paymentMethodList })
    } catch (err) {
        logger.error(err)
    }
}

const getPrevTenPages = (currPage) => {    
    if (currPage >= 10) {
        return (Math.floor(currPage / 10) ) * 10 - 9
    }
    return null
}

const getNextTenPages = (maxPage, currPage) => {    
    const CEILING_TEN_PAGES = Math.ceil( ( currPage + 1 ) / 10) * 10 + 1

    if (maxPage > CEILING_TEN_PAGES) {
        return CEILING_TEN_PAGES
    }

    return null
}

const getAllTrx = async (currPage, limit) => {
    try {
        return await Expense.aggregate([
            {
                $project: {
                    trx_date: {
                        $dateToString: {
                            format: '%d/%m/%Y',
                            date: '$trx_date'
                        }
                    },
                    trx_desc: 1,
                    currency: 1,
                    amount: 1,
                    payment_method: 1,
                    remark: 1
                }
            }, 
            {
                $sort: {trx_date: -1}
            },
            {
                $skip: (currPage - 1) * limit
            },
            {
                $limit: limit
            }
        ])
    } catch (e) {
        logger.error(`getTrx() error: ${e}`)
    }
}

const viewTrx = async (req, res) => {
    const currPage = parseInt(req.query.page) || 1
    const RECORD_LIMIT = 10
    
    try {
        const trxNum = await Expense.countDocuments()
        const maxPage = Math.ceil(trxNum / RECORD_LIMIT)

        // for pagination bar
        const PREVIOUS_TEN_PAGES_START = getPrevTenPages(currPage)
        const NEXT_TEN_PAGES_START = getNextTenPages(maxPage, currPage)
        logger.debug(`NEXT_TEN_PAGES_START: ${NEXT_TEN_PAGES_START}`)

        const allTrxs = await getAllTrx(currPage, RECORD_LIMIT)
        logger.debug(`Number of transactions fetched: ${allTrxs?.length}`)

        res.render('view-expense', { allTrxs, currPage, maxPage, 
                                        PREVIOUS_TEN_PAGES_START,
                                        NEXT_TEN_PAGES_START,
                                        trxNum })
    } catch (e) {
        logger.error(`viewTrx() | ${e}`)
        res.send('error')
    }
}

const deleteTrx = async (req, res) => {
    const currPage = parseInt(req.query.page) || 1
    const trxId = req.body.trx_id
    logger.debug(`deleteTrx() | Record Id fetched [${trxId}]`)
    logger.debug(`${currPage}`)

    try {
        const trx = await Expense.findOne( { _id: trxId } )
        
        if (!trx) {
            logger.error(`Transaction Not Found: cannot be deleted.`)
            res.render('view-expense')
            return
        }

        await trx.deleteOne()
        logger.info(`Transaction id [${trxId}] deleted.`)
        res.render('view-expense')
    } catch (err) {
        logger.error('err')
    }
}

const getMenu = async (req, res) => {
    const allMenuFuncs = await Menu.find().sort({ _id: 1 }).lean()
    res.render('menu', { allMenuFuncs })
}

const dataBackup = async (req, res) => {
    try {
        const data = await Expense.aggregate( [
            {
                $project: {
                    trx_date: { 
                        $dateToString: { 
                            format: "%Y-%m-%d",
                            date: "$trx_date" 
                        } 
                    },
                    trx_desc: 1,
                    currency: 1,
                    amount: 1,
                    payment_method: 1,
                    remark: 1,
                    update_date: { 
                        $dateToString: { 
                            format: "%Y-%m-%d", 
                            date: "$update_date" 
                        } 
                    },
                    _id: 0,
                }
            }
        ])
        convertToXlsxFile(data, FILE_TYPE.EXPENSE, res)
    } catch (e) {
        logger.error(`dataBackup() | ${e}`)
        // res.send('error')
    }
}

module.exports = { addTrx,
                    viewTrx, 
                    getMenu, 
                    getAddExpensePage, 
                    deleteTrx,
                    dataBackup }