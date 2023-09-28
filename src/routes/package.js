const express = require('express');
const router = express.Router();

const contronllers = require('../controller/package');

router.get('/', contronllers.list);
router.get('/add-edit', contronllers.addEdit);

module.exports = router;
