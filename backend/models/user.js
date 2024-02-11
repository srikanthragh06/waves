const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const { sequelize } = require("../db/sequelize");
const Sequelize = require("sequelize");

const User = sequelize.define(
    "User",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: [4, 32],
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [["Male", "Female", "Others"]],
            },
        },
        dateOfBirth: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        bio: {
            type: DataTypes.TEXT,
            validate: {
                len: [0, 500],
            },
        },
        profilePictureFileType: {
            type: DataTypes.STRING,
        },
        followers: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
            validate: {
                min: 0,
            },
        },
        following: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
            validate: {
                min: 0,
            },
        },
        posts: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
            validate: {
                min: 0,
            },
        },
    },
    {
        timestamps: true,
        hooks: {
            beforeSave: async (user) => {
                if (user.changed("password")) {
                    const hashedPassword = await bcrypt.hash(user.password, 10);
                    user.password = hashedPassword;
                }
            },
        },
    }
);

User.prototype.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = User;
