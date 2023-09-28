const express = require('express');
const router = express.Router();

const contronllers = require('../controller/reset-password');

router.get('/', contronllers.show);
router.post('/', contronllers.verifyPasswordToken);
module.exports = router;
