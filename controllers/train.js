const User = require("../db/models/user");
const Station = require("../db/models/station");
const Train = require("../db/models/train");

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

    const data = await Train.create({
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
    const { id } = req.params;

    if (!id) {
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

    const train = await Train.findByPk(id);

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
