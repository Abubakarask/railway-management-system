const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const Station = require("./station");

const Train = sequelize.define("train", {
  publicId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  source: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Station,
      key: "publicId",
    },
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Station,
      key: "publicId",
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
