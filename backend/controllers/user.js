const {
    sendSuccessResponse,
    sendClientSideError,
    sendFileResponse,
} = require("../utils/response-templates");
const User = require("../models/user");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");
const { doesFileExist, deleteFile } = require("../utils/utils");
const { sequelize } = require("../db/sequelize");
const { Op } = require("sequelize");

exports.loginHandler = async (req, res, next) => {
    try {
        const { user: userDetails } = { ...req.body };
        const { username, email, password } = userDetails;

        await sequelize.transaction(async (t) => {
            const user = username
                ? await User.findOne({ where: { username }, transaction: t })
                : await User.findOne({ where: { email }, transaction: t });
            if (!user)
                return sendClientSideError(
                    req,
                    res,
                    "Invalid credentials!",
                    401
                );

            const isCorrectPassword = await user.comparePassword(password);
            if (!isCorrectPassword)
                return sendClientSideError(
                    req,
                    res,
                    "Invalid credentials",
                    401
                );

            const jwtToken = jsonwebtoken.sign(
                { userId: user.id },
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
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        gender: user.gender,
                        bio: user.bio,
                        profilePicture: user.profilePicture,
                        dataOfBirth: user.dateOfBirth,
                        followers: user.followers,
                        following: user.following,
                        posts: user.posts,
                    },
                }
            );
        });
    } catch (err) {
        next(err);
    }
};

exports.signupHandler = async (req, res, next) => {
    try {
        const { user: userDetails } = { ...req.body };
        const { username, email } = userDetails;

        await sequelize.transaction(async (t) => {
            const userDuplicateUsername = await User.findOne({
                where: { username },
                transaction: t,
            });
            if (userDuplicateUsername)
                return sendClientSideError(
                    req,
                    res,
                    `username: ${username} already taken`
                );

            const userDuplicateEmail = await User.findOne({
                where: { email },
                transaction: t,
            });
            if (userDuplicateEmail)
                return sendClientSideError(
                    req,
                    res,
                    `email: ${email} already taken`
                );

            const newUser = await User.create(
                { ...userDetails },
                { transaction: t }
            );

            const jwtToken = jsonwebtoken.sign(
                { userId: newUser.id },
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
                    jwtToken,
                    user: {
                        id: newUser.id,
                        username: newUser.username,
                        email: newUser.email,
                        gender: newUser.gender,
                        bio: newUser.bio,
                        profilePicture: newUser.profilePicture,
                        dataOfBirth: newUser.dateOfBirth,
                        followers: newUser.followers,
                        following: newUser.following,
                        posts: newUser.posts,
                    },
                }
            );
        });
    } catch (err) {
        next(err);
    }
};

exports.changePasswordHandler = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { oldPassword, newPassword } = req.body;

        await sequelize.transaction(async (t) => {
            const user = await User.findByPk(userId, { transaction: t });

            const isCorrectOldPassword = await user.comparePassword(
                oldPassword
            );
            if (!isCorrectOldPassword)
                return sendClientSideError(
                    req,
                    res,
                    "Invalid old password",
                    401
                );

            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            const [updatedRowsCount, updatedUsers] = await User.update(
                {
                    password: hashedNewPassword,
                },
                {
                    where: {
                        id: userId,
                    },
                    returning: true,
                    transaction: t,
                }
            );

            if (updatedRowsCount === 0 || !updatedUsers[0])
                return sendClientSideError(req, res, "Password Change failed");

            return sendSuccessResponse(
                req,
                res,
                `Password changed successfully!`
            );
        });
    } catch (err) {
        next(err);
    }
};

exports.updateUserDetails = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { username, gender, bio, dateOfBirth } = req.body.user;

        await sequelize.transaction(async (t) => {
            const [updatedRowsCount, updatedUsers] = await User.update(
                {
                    username,
                    gender,
                    bio,
                    dateOfBirth,
                },
                {
                    where: {
                        id: userId,
                    },
                    returning: true,
                    transaction: t,
                }
            );

            if (updatedRowsCount === 0 || !updatedUsers[0])
                return sendClientSideError(req, res, "Updation failed");

            const updatedUser = updatedUsers[0].get();

            sendSuccessResponse(req, res, `update successful`, 200, {
                user: {
                    id: updatedUser.id,
                    username: updatedUser.username,
                    bio: updatedUser.bio,
                    gender: updatedUser.gender,
                    dateOfBirth: updatedUser.dateOfBirth,
                    followers: updatedUser.followers,
                    following: updatedUser.following,
                    posts: updatedUser.posts,
                },
            });
        });
    } catch (err) {
        next(err);
    }
};

exports.uploadProfilePicture = async (req, res, next) => {
    try {
        const userId = req.user?.id;

        await sequelize.transaction(async (t) => {
            const user = await User.findByPk(userId);

            if (req.error) {
                return sendClientSideError(req, res, req.error);
            }
            if (!req.file) {
                return sendClientSideError(req, res, "Missing file");
            }

            const newImageFileType = req.file.mimetype.split("/")[1];
            const oldImageFileType = user.profilePictureFileType;
            if (
                user.profilePictureFileType &&
                oldImageFileType !== newImageFileType
            ) {
                console.log("check");
                const oldImagePath = path.join(
                    __dirname,
                    "..",
                    "media",
                    "profilePictures",
                    `${String(userId)}.${oldImageFileType}`
                );

                const isDeletedOldImage = await deleteFile(oldImagePath);
                if (!isDeletedOldImage)
                    return sendClientSideError(
                        req,
                        res,
                        "Failed to remove old profile picture"
                    );
            }

            user.profilePictureFileType = newImageFileType;
            await user.save({ transaction: t });

            sendSuccessResponse(
                req,
                res,
                `Profile picture of ${req.user.username} uploaded successfully`,
                201
            );
        });
    } catch (err) {
        next(err);
    }
};

exports.getProfilePicture = async (req, res, next) => {
    try {
        const { userId } = req.params;
        if (!userId || userId == "undefined")
            return sendClientSideError(
                req,
                res,
                "Incorrect request parameter. Request parameter must be a userId"
            );

        await sequelize.transaction(async (t) => {
            const user = await User.findByPk(userId);
            if (!user)
                return sendClientSideError(
                    req,
                    res,
                    "User with this userId doesnt exist",
                    404
                );

            if (!user.profilePictureFileType) {
                return sendClientSideError(
                    req,
                    res,
                    `${user.username} doesn't have a profile picture`
                );
            }

            const imagePath = path.join(
                __dirname,
                "..",
                "media",
                "profilePictures",
                `${String(userId)}.${user.profilePictureFileType}`
            );
            const fileExists = await doesFileExist(imagePath);
            if (!fileExists) {
                return sendClientSideError(req, res, "File doesnt exist", 404);
            }

            return sendFileResponse(req, res, imagePath);
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteProfilePicture = async (req, res, next) => {
    try {
        const userId = req.user.id;

        await sequelize.transaction(async (t) => {
            const user = await User.findByPk(userId);
            if (!user.profilePictureFileType)
                return sendClientSideError(
                    req,
                    res,
                    `${user.username} doesnt have a profile picture`
                );

            const imagePath = path.join(
                __dirname,
                "..",
                "media",
                "profilePictures",
                `${String(userId)}.${user.profilePictureFileType}`
            );

            const fileExists = await doesFileExist(imagePath);
            if (!fileExists)
                return sendClientSideError(req, res, "File doesnt exist", 404);

            const fileDeleted = await deleteFile(imagePath);
            if (!fileDeleted)
                return sendClientSideError(req, res, "Failed to delete image");

            user.profilePictureFileType = null;
            await user.save({ transaction: t });

            sendSuccessResponse(
                req,
                res,
                `Profile picture of ${req.user.username} has been removed successfully`,
                200
            );
        });
    } catch (err) {
        next(err);
    }
};

exports.searchHandler = async (req, res, next) => {
    try {
        const { searchKey } = req.params;
        if (!searchKey)
            return sendClientSideError(
                req,
                res,
                "Missing request parameter searchKey"
            );

        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page, 10);
        limit = parseInt(limit, 10);
        const offset = (page - 1) * limit;

        await sequelize.transaction(async (t) => {
            const users = await User.findAll({
                where: {
                    username: { [Op.iLike]: `%${searchKey}%` },
                },

                attributes: ["id", "username", "followers", "posts"],
                offset,
                limit,
                transaction: t,
            });
            sendSuccessResponse(req, res, "users successfully retreived", 200, {
                users,
            });
        });
    } catch (error) {
        next(error);
    }
};

exports.getProfileDetailsHandler = async (req, res, next) => {
    try {
        const { userId } = req.params;

        if (!userId)
            return sendClientSideError(req, res, "User id is missing!!");

        await sequelize.transaction(async (t) => {
            const user = await User.findByPk(userId);
            if (!user)
                return sendClientSideError(
                    req,
                    res,
                    "User with this id doesn't exist",
                    404
                );

            return sendSuccessResponse(
                req,
                res,
                "User Details retreived successfully",
                200,
                {
                    user: {
                        id: user.id,
                        username: user.username,
                        bio: user.bio,
                        gender: user.gender,
                        dateOfBirth: user.dateOfBirth,
                        followers: user.followers,
                        following: user.following,
                        posts: user.posts,
                    },
                }
            );
        });
    } catch (err) {
        next(err);
    }
};

exports.getIdThroughUsernameHandler = async (req, res, next) => {
    try {
        const { username } = req.params;
        await sequelize.transaction(async (t) => {
            const user = await User.findOne({
                where: {
                    username,
                },
                transaction: t,
            });

            if (!user)
                return sendClientSideError(
                    req,
                    res,
                    "user with this username doesnt exist"
                );

            return sendSuccessResponse(
                req,
                res,
                `User id of ${username} retreived successfully`,
                200,
                { userId: user.id }
            );
        });
    } catch (err) {
        next(err);
    }
};
