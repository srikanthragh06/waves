const path = require("path");
const fs = require("fs");

exports.logResponse = (req, resMessage, statusCode = 200) => {
    const timestamp = new Date().toLocaleString();
    const fileName = `${timestamp.split(",")[0].replaceAll("/", "-")}.log`;
    const filePath = path.join("logs", "responses", fileName);

    const logMsg = `RESPONSE | ${statusCode} | ${timestamp} | ${req.method} | ${req.originalUrl} | ${resMessage}`;

    console.log(logMsg);

    fs.appendFile(filePath, logMsg + "\n", (err) => {
        if (err) {
            console.error(err);
        }
    });
};
