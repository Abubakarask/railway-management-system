const { Sequelize } = require("sequelize");
const TrainSeat = require("../db/models/seat");
const Train = require("../db/models/train");

exports.bookSeat = async (req, res) => {
  try {
    const user = req.user;

    const { trainId } = req.body;
    const train = await Train.findByPk(trainId);

    if (!train) {
      return res.status(404).json({
        status: false,
        message: "Train not found",
        code: "NOT_FOUND",
      });
    }

    const { totalSeats, availableSeats } = train;

    if (availableSeats === 0) {
      return res.status(404).json({
        status: false,
        message: "Seat not available for this train",
        code: "NOT_AVAILABLE",
      });
    }

    const seatId = totalSeats - availableSeats + 1;
    const seatNumber = `SC00${seatId}`;

    const seat_record = await TrainSeat.create({
      seatNumber,
      trainId: trainId,
      bookedByUser: user.id,
    });

    await Train.update(
      { availableSeats: Sequelize.literal("GREATEST(availableSeats - 1, 0)") },
      { where: { id: trainId } }
    );

    res.status(200).json({
      success: true,
      message: "Seat booked successfully",
      content: {
        data: seat_record,
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
