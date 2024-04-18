const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  "root",
  process.env.DB_PASS,
  {
    dialect: "mysql",
    host: "localhost",
  }
);

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

// sequelize.sync()
//   .then(() => {
//     console.log('Tables created successfully!');
//   })
//   .catch((error) => {
//     console.error('Error creating tables:', error);
//   });


module.exports = sequelize;
