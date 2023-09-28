const User = require('../models/user');
const sendMail = require('../helpers/sendMail');
const show = async (req, res, next) => {
  try {
    res.render('forgot-password', { title: 'forgot-password' });
  } catch (error) {
    console.log(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.render('forgot-password', {
        title: 'Forgot-password',
        error: 'vui lòng nhập email',
      });
    const user = await User.findOne({
      email: email,
    });
    if (!user)
      return res.render('forgot-password', {
        title: 'Forgot-password',
        error: 'email chưa được đăng ký',
      });

    const { passwordReset } = await user.createChangePasswordToken();
    await user.save();

    const mailOptions = {
      from: {
        name: 'phongtro123',
        address: 'phongtro123@gmail.com',
      }, // sender address
      to: user.email, // list of receivers
      subject: 'Khôi phục mật khẩu', // Subject line
      html: `Bạn có thể đặt lại mật khẩu bằng liên kết sau:
      https://puce-determined-raven.cyclic.app/reset-password?token=${passwordReset}`, // html body
    };
    await sendMail(mailOptions);

    return res.render('forgot-password', {
      title: 'Forgot-password',
    });
  } catch (error) {
    console.log(error);
    res.render('forgot-password', {
      title: 'Forgot-password',
    });
  }
};

module.exports = { show, forgotPassword };
