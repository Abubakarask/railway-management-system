const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const sequelize = require("./db/sequelize");
const router = require("./routes/routes");

dotenv.config();

const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(router);

module.exports = app;
