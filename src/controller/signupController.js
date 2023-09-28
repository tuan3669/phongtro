const User = require("../models/user");
const signUp = async (req, res) => {
  res.render("signUp", { title: "Đăng Ký" });
};
const register = async (req, res) => {
  const { username, password, email, phone } = req.body;
  const user = new User({
    username,
    password,
    email,
    phone,
    avatar:
      "https://images.unsplash.com/photo-1660902179734-c94c944f7830?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1555&q=80",
  });
  try {
    await user.save();
    res.redirect("/signin");
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  signUp,
  register,
};
