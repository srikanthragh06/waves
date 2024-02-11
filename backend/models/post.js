const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/sequelize");
const User = require("./user");

const Post = sequelize.define("Post", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            len: [0, 800],
        },
    },
    mediaFileName: {
        type: DataTypes.STRING,
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    dislikes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    comments: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

Post.belongsTo(User, { foreignKey: "userId" });

module.exports = Post;
