const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const Station = require("./station");

const Train = sequelize.define("train", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  source: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Station,
      key: "id",
    },
  },
  destination: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Station,
      key: "id",
    },
  },
  startsAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endsAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  totalSeats: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  availableSeats: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

// Train.belongsTo(Station, { foreignKey: "source", as: "sourceStation" });
// Train.belongsTo(Station, {
//   foreignKey: "destination",
//   as: "destinationStation",
// });

module.exports = Train;
