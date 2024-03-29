const path = require("path");
const fs = require("fs");
const { consoleLogGreen, consoleLogRed } = require("./colorLogging");

exports.logResponse = (req, resMessage, statusCode = 200) => {
    const timestamp = new Date().toLocaleString();
    const fileName = `${timestamp.split(",")[0].replaceAll("/", "-")}.log`;
    const filePath = path.join("logs", "responses", fileName);

    const logMsg = `RESPONSE | ${statusCode} | ${timestamp} | ${req.method} | ${req.originalUrl} | ${resMessage}`;

    if (Math.floor(statusCode / 100) == 2) {
        consoleLogGreen(logMsg);
    } else {
        consoleLogRed(logMsg);
    }

    const responsesFolderPath = path.join(__dirname, "..", "logs", "responses");
    if (!fs.existsSync(responsesFolderPath))
        fs.mkdirSync(responsesFolderPath, { recursive: true });

    fs.appendFile(filePath, logMsg + "\n", (err) => {
        if (err) {
            console.error(err);
        }
    });
};

exports.logSocket = (msg) => {
    const logsSocketsPath = path.join(__dirname, "..", "logs", "sockets");
    if (!fs.existsSync(logsSocketsPath))
        fs.mkdirSync(logsSocketsPath, { recursive: true });

    const timestamp = new Date().toLocaleString();
    const fileName = `${timestamp.split(",")[0].replaceAll("/", "-")}.log`;
    const filePath = path.join(logsSocketsPath, fileName);

    const logMsg = `${timestamp} | ${msg}`;

    fs.appendFile(filePath, logMsg + "\n", (err) => {
        if (err) {
            console.error(err);
        }
    });
};
