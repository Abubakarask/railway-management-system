const jwt = require("jsonwebtoken");
const User = require("../db/models/user");
require("dotenv").config();

exports.isAdminAuthenticated = async (req, res, next) => {
  try {
    const { access_token } = req.cookies;

    if (!access_token) {
      return res.status(401).json({
        message: "Please login first",
      });
    }

    const ADMIN_AUTH_KEY = process.env.ADMIN_AUTH_KEY;
    const apiKey = req.headers["api-key"];

    if (apiKey !== ADMIN_AUTH_KEY) {
      return res.status(401).json({ error: "Unauthorized" });
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
