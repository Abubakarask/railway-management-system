const jwt = require("jsonwebtoken");
const User = require("../db/models/user");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const { access_token } = req.cookies;

    if (!access_token) {
      return res.status(401).json({
        message: "Please login first",
      });
    }

    const decoded = jwt.verify(access_token, process.env.JWT_SECRET);
    req.user = await User.findOne({ where: { id: decoded.id } });
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};
