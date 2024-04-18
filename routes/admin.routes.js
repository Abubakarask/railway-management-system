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

adminRouter.get("/", async (req, res) => {
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
adminRouter.route("/auth/signup").post(signup);
adminRouter.route("/auth/signin").post(signin);
adminRouter.route("/auth/me").get(isAdminAuthenticated, myProfile);
adminRouter.route("/auth/signout").get(isAdminAuthenticated, signout);

// Station APIs
adminRouter.route("/station/create").post(isAdminAuthenticated, stationCreate);
adminRouter.route("/station/get/:publicId").get(isAdminAuthenticated, getStationById);

// Train APIs
adminRouter.route("/train/create").post(isAdminAuthenticated, trainCreate);
adminRouter.route("/train/get/:publicId").get(isAdminAuthenticated, getTrainById);
adminRouter.route("/train/find").get(isAdminAuthenticated, findTrains);

// Seat APIs
adminRouter.route("/seat/get/:seatNumber").get(isAdminAuthenticated, getSeatDetails);

module.exports = adminRouter;
