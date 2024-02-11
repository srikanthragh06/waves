const mongoose = require("mongoose");
const { consoleLogRed, consoleLogCyan } = require("../utils/colorLogging");

const connectMongoDB = (url) => {
    mongoose
        .connect(url)
        .then(() => {
            consoleLogCyan(`DB connection to ${url} successfully :)`);
        })
        .catch((err) => {
            consoleLogRed(`DB connection to ${url} failed :(`);
            console.error(err);
        });
};

module.exports = { connectMongoDB };
