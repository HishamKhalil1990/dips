const express = require('express');
const router = express.Router();
const controller = require('../controllers/reportController')

router.get('/',controller.salesReportPage);
router.post('/data/:start/:end',controller.salesReportData);

module.exports = router