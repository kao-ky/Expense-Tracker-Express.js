const express = require('express')
const menuServices = require('../services/menuServices')
const router = express.Router()

router.get('/', (req, res) => { menuServices.getMenu(req, res)})

router.get('/add-expense', (req, res) => menuServices.getAddExpensePage(req, res))

router.post('/add-expense', (req, res) => menuServices.addTrx(req, res))

router.get('/quick-add-expense', (req, res) => menuServices.getQuickAddPage(req, res))

router.post('/delete-expense', (req, res) => menuServices.deleteTrx(req, res))

router.get('/data-backup', (req, res) => menuServices.dataBackup(req, res))

router.get('/view-expense', (req, res) => menuServices.viewTrx(req, res))



module.exports = router