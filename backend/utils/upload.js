const multer = require("multer");

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
        cb(null, "images/profilePictures");
    },
    filename: (req, file, cb) => {
        const fileType = file.mimetype.split("/")[1];
        const uniqueFilename = `${String(req.user._id)}.${fileType}`;
        cb(null, uniqueFilename);
    },
});

exports.uploadProfilePictureFile = multer({
    storage: uploadProfilePictureFileStorage,
    fileFilter: imageFilter,
});
