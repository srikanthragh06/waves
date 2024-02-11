const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../db/sequelize");
const User = require("./user");
const Post = require("./post");

const Comment = sequelize.define("Comment", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        validate: {
            notEqualReplyCommentId(value) {
                if (value === this.replyCommentId) {
                    throw new Error("id cannot be equal to replyCommentId");
                }
            },
        },
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    replyCommentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            len: [0, 300],
        },
    },
});

Comment.belongsTo(User, { foreignKey: "userId", as: "user" });
Comment.belongsTo(Post, { foreignKey: "postId", as: "post" });
Comment.belongsTo(Comment, {
    foreignKey: "replyCommentId",
    as: "replyComment",
});

module.exports = Comment;
