const express = require('express');
const User = require('../../models/user');
const { verifyToken } = require('../../middlewares/middlewaresController');
const fileUploader = require('../../middlewares/cloudinary');

const router = express.Router();
router.get('/', verifyToken, async (req, res) => {
  const userId = req?.user?.id;
  if (!userId) return res.status(401);
  const user = await User.findById(userId).select('-password');
  res.status(200).json(user);
});

// update profile
router.put('/', verifyToken, fileUploader.single('file'), async (req, res) => {
  try {
    const userId = req?.user?.id;
    if (!userId) return res.status(401);
    const user = await User.findById(userId).select('-password');
    const { name, email, phone } = req.body;
    user.username = name;
    user.email = email;
    user.phone = phone;
    if (req.file) {
      user.avatar = req.file.path;
    }

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

router.put('/change-password', verifyToken, async (req, res) => {
  try {
    const userId = req?.user?.id;
    if (!userId) return res.status(401);
    const user = await User.findById(userId);
    // isvalidpassword
    const { oldPassword, newPassword } = req.body;

    const isMatch = await user.isValidPassword(oldPassword);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });
    user.password = newPassword;  
    await user.save();
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

module.exports = router;
