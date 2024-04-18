const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const Train = require("./train");
const User = require("./user");

const TrainSeat = sequelize.define("TrainSeat", {
  seatNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  trainId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Train,
      key: "publicId",
    },
  },
  bookedByUser: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
});

module.exports = TrainSeat;
