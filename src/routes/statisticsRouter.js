const express = require('express');
const router = express.Router();

router.get('/statistics', (req, res) => {
  res.render('./admin/statistics/statistics', { title: 'Thống kê' });
});

module.exports = router;
