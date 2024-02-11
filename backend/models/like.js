const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/sequelize");
const User = require("../models/user");
const Post = require("./post");

const Like = sequelize.define(
    "Like",
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        postId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
    },
    {
        indexes: [
            {
                unique: true,
                fields: ["userId", "postId"],
            },
        ],
    }
);

Like.belongsTo(User, { foreignKey: "userId" });
Like.belongsTo(Post, { foreignKey: "postId" });

module.exports = Like;
