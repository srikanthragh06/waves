const { DataTypes, Sequelize } = require("sequelize");
const { sequelize } = require("../db/sequelize");
const User = require("./user");

const Conversation = sequelize.define(
    "Conversation",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        userId1: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: {
                name: "unique_user_pair",
                msg: "userId pair must be unique",
            },
            validate: {
                isLessThanUserId2(value) {
                    if (value >= this.userId2) {
                        throw new Error("userId1 must be less than userId2");
                    }
                },
            },
        },
        userId2: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: {
                name: "unique_user_pair",
                msg: "userId pair must be unique",
            },
        },
        userId1IsRead: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        userId2IsRead: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        lastMessage: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                len: [0, 1500],
            },
        },
        lastMessageTime: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    { timestamps: true }
);

Conversation.belongsTo(User, { foreignKey: "userId1", as: "user1" });
Conversation.belongsTo(User, { foreignKey: "userId2", as: "user2" });

module.exports = Conversation;
