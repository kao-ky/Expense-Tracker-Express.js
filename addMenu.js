
const Menu = require('./models/MenuFunction')

// Standalone code
// const dbConnect = require('./models/MenuFunction')
// dbConnect()

const addExpense = new Menu({
    name: 'Add Expense',
    img: '/images/add-expense.png',
    endpoint: '/menu/add-expense',
    _id: 1
})

const viewDeleteExpense = new Menu({
    name: 'View Expense',
    img: '/images/view-expense.png',
    endpoint: '/menu/view-expense',
    _id: 2
})

const dataBackup = new Menu({
    name: 'Data Backup',
    img: '/images/data-backup.jpg',
    endpoint: '/menu/data-backup',
    _id: 3
})

const report = new Menu({
    name: 'Report',
    img: '/images/report.png',
    endpoint: '/report',
    _id: 4
})

const allMenus = [addExpense, viewDeleteExpense, dataBackup, report]

const createMenu = () => {
    allMenus.forEach( async (func) => {
        try {
            if (! await Menu.findOne({ name: func.name })) {
                await func.save()
                logger.info(`Menu function [${func.name}] created.`)
            }
        } catch (e) {
            logger.error(e)
        }
    })
}

module.exports = createMenu