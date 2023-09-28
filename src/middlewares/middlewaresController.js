const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
  const token = req.headers.token;
  if (token) {
    const accessToken = token.split(' ')[1];
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        res.status(403).json('Token is not valid!');
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json("You're not authenticated");
  }
};

const isAdmin = (req, res, next) => {
  console.log(req.user.role);
  if (req.user.role === 'admin') next();
  return res.status(403);
};

module.exports = {
  verifyToken,
  isAdmin,
};
