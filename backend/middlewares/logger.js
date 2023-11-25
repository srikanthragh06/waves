const fs = require("fs");
const path = require("path");

exports.logRequest = (req, res, next) => {
    const timestamp = new Date().toLocaleString();
    const fileName = `${timestamp.split(",")[0].replaceAll("/", "-")}.log`;
    const filePath = path.join("logs", "requests", fileName);

    const logMsg = `REQUEST | ${timestamp} | ${req.method} | ${req.originalUrl}`;

    console.log(logMsg);

    fs.appendFile(filePath, logMsg + "\n", (err) => {
        if (err) {
            console.error(err);
        }
    });

    return next();
};
