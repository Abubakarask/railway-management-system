const express = require("express");
const { signup, signin, myProfile, signout } = require("../controllers/user");
const { stationCreate, getStationById } = require("../controllers/station");
const {
  trainCreate,
  getTrainById,
  findTrains,
} = require("../controllers/train");
const { bookSeat, getSeatDetails } = require("../controllers/seat");
const { isAdminAuthenticated } = require("../middlewares/auth.admin");

const adminRouter = new express.Router();

router.get("/", async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Server from Admin is working:).....",
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
router.route("/auth/me").get(isAdminAuthenticated, myProfile);
router.route("/auth/signout").get(isAdminAuthenticated, signout);

// Station APIs
router.route("/station/create").post(isAdminAuthenticated, stationCreate);
router.route("/station/get/:publicId").get(isAdminAuthenticated, getStationById);

// Train APIs
router.route("/train/create").post(isAdminAuthenticated, trainCreate);
router.route("/train/get/:publicId").get(isAdminAuthenticated, getTrainById);
router.route("/train/find").get(isAdminAuthenticated, findTrains);

// Seat APIs
router.route("/seat/get/:seatNumber").get(isAdminAuthenticated, getSeatDetails);

module.exports = adminRouter;
