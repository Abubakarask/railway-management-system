const { Sequelize } = require("sequelize");
const TrainSeat = require("../db/models/seat");
const Train = require("../db/models/train");

exports.bookSeat = async (req, res) => {
  try {
    const user = req.user;

    const { trainPublicId, seatNumber } = req.body;

    if (!trainPublicId || !seatNumber) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "name",
            message: "Please fill all required details",
            code: "INVALID_INFO",
          },
        ],
      });
    }

    const train = await Train.findOne({ where: { publicId: trainPublicId } });

    if (!train) {
      return res.status(404).json({
        status: false,
        message: "Train not found",
        code: "NOT_FOUND",
      });
    }

    const { totalSeats } = train;

    if (!isSeatNumberValid(seatNumber, totalSeats)) {
      return res.status(400).json({
        status: false,
        message: "Invalid seat number",
        code: "INVALID_DATA",
      });
    }

    const seatRecord = await TrainSeat.findOne({
      where: {
        seatNumber,
        trainId: train.publicId,
      },
    });

    if (seatRecord) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "seatNumber",
            message: "This Seat Number is already booked",
            code: "RESOURCE_EXISTS",
          },
        ],
      });
    }

    console.log(seatNumber, train.publicId, user.id);

    const data = await TrainSeat.create({
      seatNumber,
      trainId: train.publicId,
      bookedByUser: user.id,
    });

    await Train.update(
      { availableSeats: Sequelize.literal("GREATEST(availableSeats - 1, 0)") },
      { where: { id: train.id } }
    );

    res.status(200).json({
      success: true,
      message: "Seat booked successfully",
      content: {
        data,
      },
    });
  } catch (error) {
    console.error("Error booking seat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getSeatDetails = async (req, res) => {
  try {
    const { seatNumber } = req.params;

    if (!seatNumber) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "seatNumber",
            message: "Please provide a valid station ID",
            code: "INVALID_ID",
          },
        ],
      });
    }

    const seatRecord = await TrainSeat.findOne({ where: { seatNumber } });

    if (!seatRecord) {
      return res.status(404).json({
        status: false,
        message: "Seat not found",
        code: "NOT_FOUND",
      });
    }

    res.status(200).json({
      success: true,
      content: {
        data: seatRecord,
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

// Function to check if the seat number is valid
function isSeatNumberValid(seatNumber, totalSeats) {
  const seatId = parseInt(seatNumber.substring(8));
  return seatNumber.startsWith("AC") && seatId >= 1 && seatId <= totalSeats;
}
