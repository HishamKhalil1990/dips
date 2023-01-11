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
            if(response.msg == 'done'){
                res.render('partials/salesReportTable',{results:response.data})
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