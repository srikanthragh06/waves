const {
    sendSuccessResponse,
    sendClientSideError,
    sendFileResponse,
} = require("../utils/response-templates");
const User = require("../models/user");
const jsonwebtoken = require("jsonwebtoken");
const path = require("path");
const { doesFileExist, deleteFile } = require("../utils/utils");
const fsPromises = require("fs").promises;

exports.loginHandler = async (req, res, next) => {
    try {
        const { user: userDetails } = { ...req.body };
        const { username, email, password } = userDetails;

        const user = username
            ? await User.findOne({ username })
            : await User.findOne({ email });
        if (!user)
            return sendClientSideError(req, res, "Invalid credentials!", 401);

        const isCorrectPassword = await user.comparePassword(password);
        if (!isCorrectPassword)
            return sendClientSideError(req, res, "Invalid credentials", 401);

        const jwtToken = jsonwebtoken.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            {
                expiresIn: "168h",
            }
        );

        sendSuccessResponse(
            req,
            res,
            `${user.username} logged in successfully`,
            200,
            {
                jwtToken,
                user: {
                    username: user.username,
                    email: user.email,
                    gender: user.gender,
                    bio: user.bio,
                    profilePicture: user.profilePicture,
                    dataOfBirth: user.dateOfBirth,
                },
            }
        );
    } catch (err) {
        next(err);
    }
};

exports.signupHandler = async (req, res, next) => {
    try {
        const { user: userDetails } = { ...req.body };
        const { username, email } = userDetails;

        const userDuplicateUsername = await User.findOne({ username });
        if (userDuplicateUsername)
            return sendClientSideError(
                req,
                res,
                `username: ${username} already taken`
            );

        const userDuplicateEmail = await User.findOne({ email });
        if (userDuplicateEmail)
            return sendClientSideError(
                req,
                res,
                `email: ${email} already taken`
            );

        const newUser = new User({ ...userDetails });
        await newUser.save();

        const jwtToken = jsonwebtoken.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET,
            {
                expiresIn: "168h",
            }
        );

        return sendSuccessResponse(
            req,
            res,
            `user ${username} created successfully`,
            201,
            {
                user: {
                    username: newUser.username,
                    email: newUser.email,
                    gender: newUser.gender,
                    bio: newUser.bio,
                    profilePicture: newUser.profilePicture,
                    dataOfBirth: newUser.dateOfBirth,
                },
                jwtToken,
            }
        );
    } catch (err) {
        next(err);
    }
};

exports.updateUserDetails = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { username, gender, bio, dateOfBirth } = req.body?.user;

        const user = await User.findByIdAndUpdate(userId, {
            username,
            gender,
            bio,
            dateOfBirth,
        });
        if (!user) sendClientSideError(req, res, "Updation failed");
        sendSuccessResponse(req, res, `update successful`, 200, {
            user: {
                id: user._id,
                username: user.username,
                bio: user.bio,
                gender: user.gender,
                dateOfBirth: user.dateOfBirth,
            },
        });
    } catch (err) {
        next(err);
    }
};

exports.uploadProfilePicture = async (req, res, next) => {
    try {
        const userId = req.user._id;
        if (req.error) {
            return sendClientSideError(req, res, req.error);
        }
        if (!req.file) {
            return sendClientSideError(req, res, "Missing file");
        }
        const user = await User.findById(userId);

        user.hasProfilePicture = true;
        user.profilePictureFileType = req.file.mimetype.split("/")[1];
        await user.save();

        sendSuccessResponse(
            req,
            res,
            `Profile picture of ${req.user.username} uploaded successfully`,
            201
        );
    } catch (err) {
        next(err);
    }
};

exports.getProfilePicture = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user.hasProfilePicture) {
            return sendClientSideError(
                req,
                res,
                `${user.username} doesn't have a profile picture`
            );
        }

        const imagePath = path.join(
            __dirname,
            "..",
            "images",
            "profilePictures",
            `${String(userId)}.${user.profilePictureFileType}`
        );
        const fileExists = await doesFileExist(imagePath);
        if (!fileExists) {
            return sendClientSideError(req, res, "File doesnt exist", 404);
        }

        return sendFileResponse(req, res, imagePath);
    } catch (err) {
        next(err);
    }
};

exports.deleteProfilePicture = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user.hasProfilePicture)
            return sendClientSideError(
                req,
                res,
                `${user.username} doesnt have a profile picture`
            );

        const imagePath = path.join(
            __dirname,
            "..",
            "images",
            "profilePictures",
            `${String(userId)}.${user.profilePictureFileType}`
        );

        const fileExists = await doesFileExist(imagePath);
        if (!fileExists)
            return sendClientSideError(req, res, "File doesnt exist", 404);

        const fileDeleted = await deleteFile(imagePath);
        if (!fileDeleted)
            return sendClientSideError(req, res, "Failed to delete image");

        user.hasProfilePicture = false;
        user.profilePictureFileType = null;
        await user.save();

        sendSuccessResponse(
            req,
            res,
            `Profile picture of ${req.user.username} has been removed successfully`,
            200
        );
    } catch (err) {
        next(err);
    }
};
