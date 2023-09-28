const express = require('express');
const router = express.Router();

const contronllers = require('../controller/depositHistory');

router.get('/', contronllers.list);

module.exports = router;
