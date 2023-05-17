const mongoXlsx = require('mongo-xlsx');
const fs = require('fs');

const FILE_TYPE = {
    EXPENSE: 'Expense',
    PAYMENT_METHOD: 'Payment-Method',
    CURRENCY: 'Currency'
}

const setOption = ( reportName ) => {
    return {
        save: true,
        sheetName: [],
        fileName: reportName + "_" + ( new Date().toJSON().slice(0,10) ) + ".xlsx",
        path: config.backup.path,
        defaultSheetName: "worksheet"
    }
}

const convertToXlsxFile = (data, reportName, res) => {
    try {
        const dataToJson = JSON.parse(JSON.stringify(data))
        const model = mongoXlsx.buildDynamicModel(dataToJson);
        const option = setOption(reportName)
        const dir = process.cwd() + '/' + option.path

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
            logger.info(`Backup Directory '${option.path}' created`)
        }

        mongoXlsx.mongoData2Xlsx(dataToJson, model, option, (err, data) => {
            const path = process.cwd() + '/' + data.fullPath
            if (config.backup.saveFile) {
                logger.info(`Data Backup saved at: ${path}`)
                res.download(path)
                return
            }
            res.download(path, () => {
                fs.unlink(path, err => {
                    if (err) {
                        throw err;
                    }
                })
            })
        })
    } catch (e) {
        logger.error(`convertToXlsxFile | ${e}`)
        res.send('error')
    }
}

module.exports = {FILE_TYPE, convertToXlsxFile}