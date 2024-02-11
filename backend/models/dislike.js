const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/sequelize");
const User = require("./user");
const Post = require("./post");

const Dislike = sequelize.define(
    "Dislike",
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

Dislike.belongsTo(User, { foreignKey: "userId" });
Dislike.belongsTo(Post, { foreignKey: "postId" });

module.exports = Dislike;
