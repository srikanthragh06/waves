const { Sequelize } = require("sequelize");
const { consoleLogRed, consoleLogCyan } = require("../utils/colorLogging");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.POSTGRES_DBNAME,
    process.env.POSTGRES_USERNAME,
    process.env.POSTGRES_PASSWORD,
    {
        host: process.env.POSTGRES_HOST,
        dialect: "postgres",
        logging: false,
        pool: {
            max: 100, // Adjust based on your application's needs
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
);
const connectPostGres = () => {
    sequelize
        .authenticate()
        .then(() => {
            consoleLogCyan("Connection to PostGres SQL successful :)");
        })
        .catch((err) => {
            consoleLogRed("Connection to PostGres SQL failed!!!\n", err);
            console.error(err);
        });

    sequelize
        .sync({ force: false })
        .then((res) => {
            consoleLogCyan("Synchronization of PostGres SQL successful :)");
        })
        .catch((err) => {
            consoleLogRed("Synchronization of Postgres SQL failed!!! :(");
            console.error(err);
        });
};

module.exports = { connectPostGres, sequelize };
