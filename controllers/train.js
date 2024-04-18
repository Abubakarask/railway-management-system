const User = require("../db/models/user");
const Station = require("../db/models/station");
const Train = require("../db/models/train");
const { padCount } = require("../utils/padCount");
const TrainSeat = require("../db/models/seat");

exports.trainCreate = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(401).json({
        status: false,
        errors: [
          {
            message: "You are not authorized to perform this operation",
            code: "NOT_AUTHORIZED",
          },
        ],
      });
    }

    let { name, source, destination, startsAt, endsAt, totalSeats } = req.body;

    name = name.trim();
    startsAt = new Date(startsAt);
    endsAt = new Date(endsAt);

    if (
      !name ||
      !source ||
      !destination ||
      !startsAt ||
      !endsAt ||
      !totalSeats
    ) {
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

    if (source === destination) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "source",
            message: "Train cant have same source and destination",
            code: "INVALID_DATA",
          },
        ],
      });
    }

    if (startsAt < Date.now() || endsAt < Date.now() || startsAt > endsAt) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "startsAt",
            message: "Please check the start and end time of the train",
            code: "INVALID_DATA",
          },
        ],
      });
    }

    const sourceStationRecord = await Station.findOne({
      where: { publicId: source },
    });

    if (!sourceStationRecord) {
      return res.status(404).json({
        status: false,
        message: "Source Station not found, plz add its detail first",
        code: "NOT_FOUND",
      });
    }

    const destStationRecord = await Station.findOne({
      where: { publicId: destination },
    });

    if (!destStationRecord) {
      return res.status(404).json({
        status: false,
        message: "Destination Station not found, plz add its detail first",
        code: "NOT_FOUND",
      });
    }

    const train = await Train.findOne({
      where: {
        name,
      },
    });

    if (train) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "name",
            message: "Train with this name already exists in record.",
            code: "RESOURCE_EXISTS",
          },
        ],
      });
    }

    const trainCount = await Train.count({
      where: { source, destination },
    });

    // Generate the public_id based on state, name, and count
    const count = padCount(5, trainCount + 1);
    const sourceCity = source.substring(3, 6).toUpperCase();
    const destCity = destination.substring(3, 6).toUpperCase();

    const publicId = `${sourceCity}${destCity}${count}`;

    const data = await Train.create({
      publicId,
      name,
      source,
      destination,
      startsAt,
      endsAt,
      totalSeats,
      availableSeats: totalSeats,
    });

    res.status(200).json({
      success: true,
      content: {
        data,
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

exports.getTrainById = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "id",
            message: "Please provide a valid train ID",
            code: "INVALID_ID",
          },
        ],
      });
    }

    const train = await Train.findOne({ where: { publicId } });

    if (!train) {
      return res.status(404).json({
        status: false,
        message: "Train not found",
        code: "NOT_FOUND",
      });
    }

    res.status(200).json({
      success: true,
      content: {
        data: train,
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

exports.findTrains = async (req, res) => {
  try {
    const { source, destination } = req.headers;

    const sourceStation = await Station.findOne({
      where: { publicId: source },
    });
    const destinationStation = await Station.findOne({
      where: { publicId: destination },
    });

    if (!sourceStation || !destinationStation) {
      return res.status(404).json({
        status: false,
        message: "Invalid source or destination station name",
        code: "INVALID_DATA",
      });
    }

    const trains = await Train.findAll({
      where: {
        source: sourceStation.publicId,
        destination: destinationStation.publicId,
      },
    });

    for (const train of trains) {
      const { totalSeats } = train;
      const bookedSeatRecords = await TrainSeat.findAll({
        where: { trainId: train.publicId },
      });

      // Extract booked seat numbers from bookedSeats
      const bookedSeatNumbers = bookedSeatRecords.map(
        (seat) => seat.seatNumber
      );

      // Generate available seat numbers
      const availableSeats = [];
      for (let i = 1; i <= totalSeats; i++) {
        const seatNumber = `AC${train.publicId.substring(0, 6)}${i}`;
        if (!bookedSeatNumbers.includes(seatNumber)) {
          availableSeats.push(seatNumber);
        }
      }

      // Add availableSeats attribute to the train object
      train.dataValues.availableSeats = availableSeats;
    }

    res.status(200).json({
      success: true,
      content: {
        data: trains,
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
