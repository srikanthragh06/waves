const { Op, where } = require("sequelize");
const { sequelize } = require("../db/sequelize");
const Conversation = require("../models/conversation");
const Message = require("../models/message");
const User = require("../models/user");
const {
    sendClientSideError,
    sendSuccessResponse,
    sendFileResponse,
} = require("../utils/response-templates");
const Post = require("../models/post");
const { doesFileExist, deleteFile } = require("../utils/utils");
const path = require("path");

exports.addMessageHandler = async (req, res, next) => {
    try {
        let {
            content = null,
            conversationId,
            replyMessageId,
            postId = null,
        } = req.body;
        console.log(replyMessageId);
        const senderId = req.user?.id;
        const sender = req.user;
        const mediaFileName = req.file ? req.file.filename : null;

        if (postId) {
            content = `${sender.username} shared a post`;
        } else if (mediaFileName) {
            content = `${sender.username} sent a media attachment`;
        }

        await sequelize.transaction(async (t) => {
            const conversation = await Conversation.findByPk(conversationId, {
                transaction: t,
            });
            if (!conversation) {
                return sendClientSideError(
                    req,
                    res,
                    "Conversation with this conversationId doesn't exist"
                );
            }

            const isSenderInConversation =
                conversation.userId1 === senderId ||
                conversation.userId2 === senderId;
            if (!isSenderInConversation) {
                return sendClientSideError(
                    req,
                    res,
                    "Sender is not part of this conversation"
                );
            }

            if (postId) {
                const post = await Post.findByPk(postId, { transaction: t });
                if (!post)
                    return sendClientSideError(
                        req,
                        res,
                        "Post with this postId doesnt exist"
                    );
            }

            const createdMessage = await Message.create(
                {
                    content,
                    postId,
                    mediaFileName: mediaFileName,
                    senderId,
                    conversationId,
                    replyMessageId,
                },
                { transaction: t }
            );

            let replyMessage = null;
            if (replyMessageId) {
                replyMessage = await Message.findOne({
                    where: { id: replyMessageId },
                    attributes: [
                        "id",
                        "content",
                        "postId",
                        "mediaFileName",
                        "createdAt",
                        "senderId",
                        "conversationId",
                    ],
                    include: [
                        {
                            model: User,
                            as: "sender",
                            attributes: ["id", "username"],
                        },
                    ],
                    transaction: t,
                });
            }

            const updateFields = {
                lastMessage: content,
                lastMessageTime: createdMessage.createdAt,
            };
            if (senderId === conversation.userId1) {
                updateFields.userId1IsRead = true;
                updateFields.userId2IsRead = false;
            } else if (senderId === conversation.userId2) {
                updateFields.userId1IsRead = false;
                updateFields.userId2IsRead = true;
            }
            await conversation.update(updateFields, { transaction: t });

            return sendSuccessResponse(
                req,
                res,
                "Message successfully added!",
                200,
                {
                    message: {
                        ...createdMessage.toJSON(),
                        user: {
                            id: req.user?.id,
                            username: req.user?.username,
                        },
                        replyMessage: replyMessage
                            ? replyMessage.toJSON()
                            : null,
                    },
                }
            );
        });
    } catch (err) {
        next(err);
    }
};

exports.getConversationMessagesHandler = async (req, res, next) => {
    try {
        const readerId = req.user?.id;

        const { conversationId } = req.params;
        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page, 10);
        limit = parseInt(limit, 10);
        const offset = (page - 1) * limit;

        if (!conversationId)
            return sendClientSideError(req, res, "Missing conversationId!");

        await sequelize.transaction(async (t) => {
            const conversation = await Conversation.findByPk(conversationId, {
                transaction: t,
            });
            if (!conversation)
                return sendClientSideError(
                    req,
                    res,
                    "Conversation with this conversationId doesnt exist"
                );

            const isReaderInConversation =
                conversation.userId1 == readerId ||
                conversation.userId2 == readerId;

            if (!isReaderInConversation)
                return sendClientSideError(
                    req,
                    res,
                    "Reader is not part of this conversation"
                );

            const messages = await Message.findAll({
                where: {
                    conversationId,
                },
                attributes: [
                    "id",
                    "senderId",
                    "content",
                    "mediaFileName",
                    "postId",
                    "conversationId",
                    "createdAt",
                ],
                include: [
                    {
                        model: User,
                        as: "sender",
                        attributes: ["id", "username"],
                    },
                    {
                        model: Message,
                        as: "replyMessage",
                        attributes: [
                            "id",
                            "senderId",
                            "content",
                            "mediaFileName",
                            "postId",
                            "conversationId",
                            "createdAt",
                        ],
                        include: [
                            {
                                model: User,
                                as: "sender",
                                attributes: ["id", "username"],
                            },
                        ],
                    },
                ],
                order: [["createdAt", "DESC"]],
                limit,
                offset,
                transaction: t,
            });

            if (readerId === conversation.userId1) {
                await conversation.update(
                    { userId1IsRead: true },
                    {
                        where: { id: conversationId },
                        transaction: t,
                    }
                );
            } else {
                await conversation.update(
                    { userId2IsRead: true },
                    {
                        where: { id: conversationId },
                        transaction: t,
                    }
                );
            }

            return sendSuccessResponse(
                req,
                res,
                "Messages of Conversation retreived successfully",
                200,
                { messages }
            );
        });
    } catch (err) {
        next(err);
    }
};

exports.setIsReadHandler = async (req, res, next) => {
    try {
        const readerId = req.user?.id;
        const { conversationId } = req.body;

        await sequelize.transaction(async (t) => {
            const conversation = await Conversation.findByPk(conversationId, {
                transaction: t,
            });
            if (!conversation)
                return sendClientSideError(
                    req,
                    res,
                    "Conversation with this conversationId doesnt exist"
                );

            if (readerId === conversation.userId1) {
                await conversation.update(
                    { userId1IsRead: true },
                    {
                        where: { id: conversationId },
                        transaction: t,
                    }
                );
            } else {
                await conversation.update(
                    { userId2IsRead: true },
                    {
                        where: { id: conversationId },
                        transaction: t,
                    }
                );
            }

            return sendSuccessResponse(req, res, "Set is read successful");
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteMessageHandler = async (req, res, next) => {
    try {
        const { messageId = null } = req.params;

        if (!messageId)
            return sendClientSideError(
                req,
                res,
                "Missing request parameter messageId"
            );
        const senderId = req.user?.id;

        await sequelize.transaction(async (t) => {
            const message = await Message.findByPk(messageId, {
                transaction: t,
            });
            if (!message)
                return sendClientSideError(
                    req,
                    res,
                    "Message with this messageId doesnt exist"
                );

            if (message.senderId !== senderId)
                return sendClientSideError(
                    req,
                    res,
                    "Deleter of this message is not the owner of this message"
                );

            const conversation = await Conversation.findByPk(
                message.conversationId,
                {
                    transaction: t,
                }
            );

            if (conversation.lastMessage === message.content) {
                await conversation.update(
                    { lastMessage: "" },
                    { transaction: t }
                );
            }

            const isDeleted = await Message.destroy({
                where: { id: messageId },
                transaction: t,
            });

            if (!isDeleted)
                return sendClientSideError(
                    req,
                    res,
                    "Failed to delete message"
                );

            if (message.mediaFileName) {
                const mediaPath = path.join(
                    __dirname,
                    "..",
                    "media",
                    "messages",
                    `${message.mediaFileName}`
                );
                const fileDeleted = await deleteFile(mediaPath);
            }

            return sendSuccessResponse(
                req,
                res,
                "Message deleted successfully"
            );
        });
    } catch (err) {
        next(err);
    }
};

exports.getMessageMediaHandler = async (req, res, next) => {
    try {
        const { messageId } = req.params;
        if (!messageId)
            return sendClientSideError(
                req,
                res,
                "Missing request parameter messageId"
            );

        const userId = req.user?.id;

        await sequelize.transaction(async (t) => {
            const message = await Message.findByPk(messageId, {
                transaction: t,
            });

            if (!message)
                return sendClientSideError(
                    req,
                    res,
                    "Message with this id doesnt exist"
                );

            if (!message.mediaFileName)
                return sendClientSideError(
                    req,
                    res,
                    "Message doesnt have any media attachment"
                );

            const conversation = await Conversation.findByPk(
                message.conversationId,
                { transaction: t }
            );

            if (
                userId !== conversation.userId1 &&
                userId !== conversation.userId2
            )
                return sendClientSideError(
                    req,
                    res,
                    "User doesnt not belong in this conversation"
                );

            const mediaPath = path.join(
                __dirname,
                "..",
                "media",
                "messages",
                `${String(message.mediaFileName)}`
            );
            const fileExists = await doesFileExist(mediaPath);
            if (!fileExists)
                return sendClientSideError(
                    req,
                    res,
                    "message media file doesnt exist"
                );

            return sendFileResponse(req, res, mediaPath);
        });
    } catch (err) {
        next(err);
    }
};
