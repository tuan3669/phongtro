const User = require('../models/user');

const show = async (req, res, next) => {
  const { token } = req.query;
  res.render('reset-password', { title: 'reset-password', error: '', token, message: '' });
};

const verifyPasswordToken = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.render('reset-password', {
        title: 'reset-password',
        error: 'token không hợp lệ or hết hạn',
        message: '',
        token: '',
      });

    (user.resetPasswordToken = undefined),
      (user.resetPasswordExpires = undefined),
      (user.password = password);
    await user.save();
    console.log('cập nhật thành công');
    
    return res.render('reset-password', {
      title: 'reset-password',
      message: 'Cập nhật mật khẩu mới thành công quay lại login',
      token: '',
    });
  } catch (error) {
    res.render('reset-password', {
      title: 'reset-password',
      error: 'Token không hợp lệ hoặc đã hết hạn',
      token: '',
      message: '',
    });
  }
};
module.exports = { show, verifyPasswordToken };
