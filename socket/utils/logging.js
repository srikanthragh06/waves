const path = require("path");
const fs = require("fs");

exports.logMsg = (msg) => {
    const logsFolderPath = path.join(__dirname, "..", "logs");
    if (!fs.existsSync(logsFolderPath))
        fs.mkdirSync(logsFolderPath, { recursive: true });

    const timestamp = new Date().toLocaleString();
    const fileName = `${timestamp.split(",")[0].replaceAll("/", "-")}.log`;
    const filePath = path.join(logsFolderPath, fileName);

    fs.appendFile(filePath, msg + "\n", (err) => {
        if (err) {
            console.error(err);
        }
    });
};
