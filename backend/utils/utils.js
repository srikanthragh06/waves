const fs = require("fs").promises;

exports.getYearsDifference = (startDate, endDate) => {
    const millisecondsPerYear = 3.154e10; // Approximate number of milliseconds in a year

    // Calculate the difference in milliseconds
    const timeDifference = endDate.getTime() - startDate.getTime();

    // Calculate the difference in years
    const yearsDifference = timeDifference / millisecondsPerYear;

    // Round to the nearest whole number
    return Math.round(yearsDifference);
};

exports.doesFileExist = async (filePath) => {
    try {
        await fs.access(filePath);
        return true; // File exists
    } catch (error) {
        if (error.code === "ENOENT") {
            return false; // File does not exist
        } else {
            throw error; // Propagate other errors
        }
    }
};

exports.deleteFile = async (filePath) => {
    try {
        await fs.unlink(filePath);
        return true;
    } catch (err) {
        console.error("Error deleting image:", err);
        return false;
    }
};

exports.renameFile = async (oldFilePath, newFilePath) => {
    try {
        await fs.rename(oldFilePath, newFilePath);
        return true;
    } catch (error) {
        console.error("Error renaming file:", error);
        return false;
    }
};
