const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = sequelize.define("user", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM("user", "admin"),
    allowNull: false,
    defaultValue: "user",
  },
  password: {
    type: DataTypes.STRING,
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

// Generate JWT Token
User.prototype.generateToken = async function () {
  const token = jwt.sign({ id: this.dataValues.id }, process.env.JWT_SECRET);
  await this.update({ token: token });
  return token;
};

// Hash Password
User.beforeCreate((user) => {
  return bcrypt
    .hash(user.password, 10)
    .then((hash) => {
      user.password = hash;
    })
    .catch((err) => {
      throw new Error("Error Occured while saving the Data");
    });
});

User.beforeUpdate((user) => {
  if (user.changed([user.password])) {
    return bcrypt
      .hash(user.password, 10)
      .then((hash) => {
        user.password = hash;
      })
      .catch((err) => {
        throw new Error("Error Occured while saving the Data");
      });
  }
});

module.exports = User;
