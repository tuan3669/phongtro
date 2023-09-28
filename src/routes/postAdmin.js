const express = require('express');

const router = express.Router();
const contronllers = require('../controller/postAdmin');

router.get('/', contronllers.listAll);

module.exports = router;
