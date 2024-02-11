const { DataTypes, Sequelize } = require("sequelize");
const { sequelize } = require("../db/sequelize");
const Conversation = require("../models/conversation");
const User = require("../models/user");

const Message = sequelize.define(
    "Message",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
            validate: {
                notEqualReplyMessageId(value) {
                    if (value === this.replyMessageId) {
                        throw new Error("id cannot be equal to replyMessageId");
                    }
                },
            },
        },
        senderId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        replyMessageId: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        content: {
            type: Sequelize.TEXT,
            allowNull: true,
            validate: {
                len: [0, 1500],
            },
        },
        mediaFileName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        postId: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        conversationId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    },
    {
        timestamps: true,
        // validate: {
        //     atLeastOneNull() {
        //         if (
        //             (this.mediaFileName !== null &&
        //                 this.postId === null &&
        //                 this.content === null) ||
        //             (this.mediaFileName === null &&
        //                 this.postId !== null &&
        //                 this.content === null) ||
        //             (this.mediaFileName === null &&
        //                 this.postId === null &&
        //                 this.content !== null)
        //         ) {
        //             return;
        //         }
        //         throw new Error(
        //             "Only one of postId or mediaFileName or content must be not null"
        //         );
        //     },
        // },
    }
);

Message.belongsTo(Conversation, {
    foreignKey: "conversationId",
    as: "conversation",
});

Message.belongsTo(User, {
    foreignKey: "senderId",
    as: "sender",
});

Message.belongsTo(Message, {
    foreignKey: "replyMessageId",
    as: "replyMessage",
});

module.exports = Message;
