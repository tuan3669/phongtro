const jwt = require('jsonwebtoken');
const User = require('../models/user');

const signIn = async (req, res) => {
  res.render('signIn', { title: 'Đăng Nhập' });
};

generateAccessToken = (user) => {
  // 1 phút
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: 30 * 60,
  });
};

generateRefreshToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      // req.flash('message', 'Tài khoản không tồn tại');
      console.log('Tài khoản không tồn tại');
      res.status(404).json({ message: 'Tài khoản không tồn tại' });
      res.redirect('/signin');
    } else if (!(await user.isValidPassword(password))) {
      console.log('Sai mật khẩu');
      // req.flash('message', 'Sai mật khẩu');
      res.status(404).json({ message: 'Sai mật khẩu' });
      res.redirect('/signin');
      console.log('Sai mật khẩu');
    } else {
      // Create a JWT token for the user
      const token = generateAccessToken({
        role: user.role,
        id: user._id,
      });
      const refreshToken = generateRefreshToken(user);
      // Set the JWT token as a cookie and redirect to a protected page
      res.cookie('refreshToken', refreshToken, { httpOnly: true });
      // req.flash('message', 'Đăng nhập thành công');
      console.log('Đăng nhập thành công');
      const { password, ...others } = user._doc;
      res.status(200).json({ others, token, message: 'Đăng nhập thành công' });
    }
  } catch (error) {
    console.log(error);
  }
};

// viết api logout để client gọi đến
const logout = async (req, res) => {
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Đăng xuất thành công' });
};

module.exports = {
  signIn,
  loginUser,
  logout,
};
