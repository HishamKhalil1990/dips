const functions = require('../utils/functions')

const salesReportPage = async (req,res) => {
    if(req.session.loggedin)
    {
        res.render('salesReport')
    }else{
        res.redirect('/Login')
    }
}

const salesReportData = async (req,res) => {
    const { start, end } = req.params
    if(req.session.loggedin)
    {
        const whs = req.session.whsCode
        functions.getSalesReportData(whs,start,end)
        .then(response => {
            let total = 0;
            response.data.forEach(rec => {
                total = total + parseFloat(rec.Amount)
            })
            total = parseFloat(total).toFixed(2)
            if(response.msg == 'done'){
                res.render('partials/salesReportTable',{results:response.data,total})
            }else{
                res.send('error')
            }
        })
    }else{
        res.redirect('/Login')
    }
}

module.exports = {
    salesReportPage,
    salesReportData
}