const express = require('express');
const router = express.Router();
const controller = require('../controller/category');

router.get('/', controller.list);
router.get('/add-edit', controller.addEdit);


module.exports = router;
