const express = require("express");
const { signup, signin, myProfile, signout } = require("../controllers/user");
const { isAuthenticated } = require("../middlewares/auth");
const { stationCreate, getStationById } = require("../controllers/station");
const { trainCreate, getTrainById, findTrains } = require("../controllers/train");
const { bookSeat, getSeatDetails } = require("../controllers/seat");

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

// Station APIs
router.route("/station/create").post(isAuthenticated, stationCreate);
router.route("/station/get/:publicId").get(isAuthenticated, getStationById);

// Train APIs
router.route("/train/create").post(isAuthenticated, trainCreate);
router.route("/train/get/:publicId").get(isAuthenticated, getTrainById);
router.route("/train/find").get(isAuthenticated, findTrains);

// Seat APIs
router.route("/seat/book").post(isAuthenticated, bookSeat);
router.route("/seat/get/:seatNumber").get(isAuthenticated, getSeatDetails);




module.exports = router;
