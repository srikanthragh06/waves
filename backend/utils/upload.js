const multer = require("multer");
const crypto = require("crypto");

const mediaFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "video/avi",
        "video/mp4",
        "video/mkv",
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
        req.error = "Incorrect file format";
    }
};

const imageFilter = (req, file, cb) => {
    const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (allowedImageTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
        req.error = "Incorrect file format";
    }
};

const uploadProfilePictureFileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "media/profilePictures");
    },
    filename: (req, file, cb) => {
        const fileType = file.mimetype.split("/")[1];
        const uniqueFilename = `${String(req.user.id)}.${fileType}`;
        cb(null, uniqueFilename);
    },
});

exports.uploadProfilePictureFile = multer({
    storage: uploadProfilePictureFileStorage,
    fileFilter: imageFilter,
});

const uploadPostMediaStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "media/posts");
    },
    filename: (req, file, cb) => {
        const fileType = file.mimetype.split("/")[1];
        const uniqueFilename = `${crypto
            .randomBytes(32)
            .toString("hex")}.${fileType}`;
        cb(null, uniqueFilename);
    },
});

exports.uploadPostMediaFile = multer({
    storage: uploadPostMediaStorage,
    fileFilter: mediaFilter,
});

const uploadMessageMediaStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "media/messages");
    },
    filename: (req, file, cb) => {
        const fileType = file.mimetype.split("/")[1];
        const uniqueFilename = `${crypto
            .randomBytes(32)
            .toString("hex")}.${fileType}`;
        cb(null, uniqueFilename);
    },
});

exports.uploadMessageMediaFile = multer({
    storage: uploadMessageMediaStorage,
    fileFilter: mediaFilter,
});
