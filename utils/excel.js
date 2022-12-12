require('dotenv').config()
const xlsx = require('xlsx')
const path = require('path')

const EXCEL_PATH = process.env.EXCEL_PATH
const filePath = './public/excel/'

const exportToexcel = (records,columnsName,sheetName) => {
    let exported = false
    try{
        const workBook = xlsx.utils.book_new();
        const workSheetData = [columnsName,...records]
        const workSheet = xlsx.utils.aoa_to_sheet(workSheetData)
        xlsx.utils.book_append_sheet(workBook,workSheet,sheetName)
        xlsx.writeFile(workBook,path.resolve(filePath + sheetName + '.xlsx'))
        exported = EXCEL_PATH + sheetName + '.xlsx'
    }catch(err){
        console.log(err)
    }
    return exported
}

module.exports = exportToexcel