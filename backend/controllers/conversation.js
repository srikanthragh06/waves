const { sequelize } = require("../db/sequelize");
const {
    sendClientSideError,
    sendSuccessResponse,
} = require("../utils/response-templates");
const Conversation = require("../models/conversation");
const User = require("../models/user");
const { Sequelize } = require("sequelize");

exports.createConversationHandler = async (req, res, next) => {
    try {
        const { receiverId } = req.body;
        if (!receiverId)
            return sendClientSideError(req, res, "Missing receiverId !");

        const creatorId = req.user?.id;

        if (receiverId == creatorId) {
            return sendClientSideError(
                req,
                res,
                "ReceiverId and creatorId cannot be the same!"
            );
        }

        let userId1, userId2;
        if (creatorId < receiverId) {
            userId1 = creatorId;
            userId2 = receiverId;
        } else {
            userId1 = receiverId;
            userId2 = creatorId;
        }

        await sequelize.transaction(async (t) => {
            const duplicateConversation = await Conversation.findOne({
                where: { userId1, userId2 },
                transaction: t,
            });

            if (duplicateConversation) {
                const userDetails1 = await User.findOne({
                    where: { id: duplicateConversation.userId1 },
                    attributes: ["id", "username"],
                    transaction: t,
                });

                const userDetails2 = await User.findOne({
                    where: { id: duplicateConversation.userId2 },
                    attributes: ["id", "username"],
                    transaction: t,
                });

                return sendSuccessResponse(
                    req,
                    res,
                    "Conversation between these users already exists",
                    200,
                    {
                        conversation: {
                            ...duplicateConversation.toJSON(),
                            user1: userDetails1,
                            user2: userDetails2,
                        },
                    }
                );
            }

            const newConversation = await Conversation.create(
                {
                    userId1,
                    userId2,
                    lastMessageTime: new Date(),
                },
                { transaction: t }
            );
            if (!newConversation)
                return sendClientSideError(
                    req,
                    res,
                    "Failed to create conversation"
                );

            const userDetails1 = await User.findOne({
                where: { id: newConversation.userId1 },
                attributes: ["id", "username"],
                transaction: t,
            });

            const userDetails2 = await User.findOne({
                where: { id: newConversation.userId2 },
                attributes: ["id", "username"],
                transaction: t,
            });

            return sendSuccessResponse(
                req,
                res,
                "Conversation created successfully",
                201,
                {
                    conversation: {
                        ...newConversation.toJSON(),
                        user1: userDetails1,
                        user2: userDetails2,
                    },
                }
            );
        });
    } catch (err) {
        next(err);
    }
};

exports.getUserConversationsHandler = async (req, res, next) => {
    try {
        const userId = req.user?.id;

        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page, 10);
        limit = parseInt(limit, 10);
        const offset = (page - 1) * limit;

        await sequelize.transaction(async (t) => {
            const conversations = await Conversation.findAll({
                where: {
                    [Sequelize.Op.or]: [
                        { userId1: userId },
                        { userId2: userId },
                    ],
                },
                attributes: [
                    "id",
                    "userId1",
                    "userId2",
                    "userId1IsRead",
                    "userId2IsRead",
                    "lastMessage",
                    "lastMessageTime",
                ],
                include: [
                    {
                        model: User,
                        as: "user1",
                        attributes: ["id", "username"],
                    },
                    {
                        model: User,
                        as: "user2",
                        attributes: ["id", "username"],
                    },
                ],
                limit,
                offset,
                order: [["lastMessageTime", "DESC"]],
                transaction: t,
            });

            return sendSuccessResponse(
                req,
                res,
                "User conversation retrieved successfully!",
                200,
                {
                    conversations,
                }
            );
        });
    } catch (err) {
        next(err);
    }
};
