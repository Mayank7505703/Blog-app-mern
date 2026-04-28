const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.redirect("/user/signin");
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decoded;   // IMPORTANT

    next();

  } catch (error) {
    return res.redirect("/user/signin");
  }
};

module.exports = authMiddleware;