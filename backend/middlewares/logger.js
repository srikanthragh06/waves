const fs = require("fs");
const path = require("path");
const colors = require("colors");
const { consoleLogBlue } = require("../utils/colorLogging");

exports.logRequest = (req, res, next) => {
    const timestamp = new Date().toLocaleString();
    const fileName = `${timestamp.split(",")[0].replaceAll("/", "-")}.log`;
    const filePath = path.join("logs", "requests", fileName);

    const requestsFolderPath = path.join(__dirname, "..", "logs", "requests");
    if (!fs.existsSync(requestsFolderPath))
        fs.mkdirSync(requestsFolderPath, { recursive: true });

    const logMsg = `REQUEST | ${timestamp} | ${req.method} | ${req.originalUrl}`;

    consoleLogBlue(logMsg);

    fs.appendFile(filePath, logMsg + "\n", (err) => {
        if (err) {
            console.error(err);
        }
    });

    return next();
};
