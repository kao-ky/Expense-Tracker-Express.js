const express = require('express')
const reportServices = require('../services/reportServices')
const router = express.Router()

router.use('/', (req, res) => { reportServices.getReport(req, res) } )

module.exports = router