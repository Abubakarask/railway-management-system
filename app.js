const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./routes/routes");
const adminRouter = require("./routes/admin.routes");

dotenv.config();

const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Using Routes
app.use("/api", router);
app.use("/api/admin", adminRouter);

module.exports = app;
