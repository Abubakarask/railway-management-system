const bcrypt = require("bcryptjs");
const User = require("../db/models/user");
const Station = require("../db/models/station");

exports.stationCreate = async (req, res) => {
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

    let { name, state } = req.body;

    name = name.trim();
    state = state.trim();

    if (!name || !state) {
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

    const station = await Station.findOne({
      where: {
        name,
      },
    });

    if (station) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "name",
            message: "Station already exists in record.",
            code: "RESOURCE_EXISTS",
          },
        ],
      });
    }

    const data = await Station.create({
      name,
      state,
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

exports.getStationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "id",
            message: "Please provide a valid station ID",
            code: "INVALID_ID",
          },
        ],
      });
    }

    const station = await Station.findByPk(id);

    if (!station) {
      return res.status(404).json({
        status: false,
        message: "Station not found",
        code: "NOT_FOUND",
      });
    }

    res.status(200).json({
      success: true,
      content: {
        data: station,
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
