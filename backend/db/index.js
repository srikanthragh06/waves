const mongoose = require("mongoose");

const connectMongoDB = (url) => {
    mongoose
        .connect(url)
        .then(() => {
            console.log(`DB connection to ${url} successfully :)`);
        })
        .catch((err) => {
            console.log(`DB connection to ${url} failed :(`);
            console.error(err);
        });
};

module.exports = { connectMongoDB };
