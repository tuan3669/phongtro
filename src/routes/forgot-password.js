const express = require('express');
const router = express.Router();

const contronllers = require('../controller/forgot-password');

router.get('/', contronllers.show);
router.post('/', contronllers.forgotPassword);

module.exports = router;
