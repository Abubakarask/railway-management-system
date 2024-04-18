const bcrypt = require("bcryptjs");
const User = require("../db/models/user");

exports.signup = async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;

    if (!name || !mobile || !password) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "mobile",
            message: "Please fill all required details",
            code: "INVALID_INFO",
          },
        ],
      });
    }

    const user = await User.findOne({
      where: {
        mobile,
      },
    });

    if (user) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "mobile",
            message: "User with this mobile address already exists.",
            code: "RESOURCE_EXISTS",
          },
        ],
      });
    }

    const data = await User.create({
      name,
      mobile,
      email,
      password,
    });

    const token = await data.generateToken();

    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res
      .status(200)
      .cookie("access_token", token, options)
      .json({
        success: true,
        content: {
          data,
          meta: { access_token: token },
        },
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.signin = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    const user = await User.findOne({
      where: {
        mobile,
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        errors: [
          {
            param: "mobile",
            message: "User does not exist",
            code: "DO_NOT_EXIST",
          },
        ],
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        errors: [
          {
            param: "password",
            message: "The credentials you provided are invalid",
            code: "INVALID_CREDENTIALS",
          },
        ],
      });
    }

    const token = await user.generateToken();

    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res
      .status(200)
      .cookie("access_token", token, options)
      .json({
        success: true,
        content: {
          data: { ...user },
          meta: { access_token: token },
        },
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.myProfile = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        mobile: req.user.mobile,
      },
    });

    res.status(200).json({
      success: true,
      content: { data: user },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.signout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("access_token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      })
      .json({
        success: true,
        message: "Logged Out",
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
