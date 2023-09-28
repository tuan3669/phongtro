const express = require('express');
const router = express.Router();

const contronllers = require('../controller/payment');

/**
 * Created by CTT VNPAY
 */

router.get('/package', contronllers.list);
router.get('/vnpay_return', contronllers.vnpay_return);

module.exports = router;
