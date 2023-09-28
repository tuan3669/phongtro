const express = require('express');
const router = express.Router();

router.get('/profile', (req, res) => {
  res.render('./admin/profile/profile', { title: 'Profile' });
});

router.get('/profile/change-password', (req, res) => {
  res.render('./admin/profile/change-password', { title: 'Change Password' });
});

module.exports = router;
