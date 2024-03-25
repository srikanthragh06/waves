const colors = require("colors");

exports.consoleLogRed = (msg) => {
    console.log(colors.red(msg));
};

exports.consoleLogBlue = (msg) => {
    console.log(colors.blue(msg));
};

exports.consoleLogGreen = (msg) => {
    console.log(colors.green(msg));
};

exports.consoleLogCyan = (msg) => {
    console.log(colors.cyan(msg));
};

exports.consoleLogYellow = (msg) => {
    console.log(colors.yellow(msg));
};
