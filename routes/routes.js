const express = require("express");
const { signup, signin, myProfile, signout } = require("../controllers/user");
const { isAuthenticated } = require("../middlewares/auth");

const router = new express.Router();

router.get("/", async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Server is working:).....",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

//User APIs
router.route("/auth/signup").post(signup);
router.route("/auth/signin").post(signin);
router.route("/auth/me").get(isAuthenticated, myProfile);
router.route("/auth/signout").get(isAuthenticated, signout);

module.exports = router;
