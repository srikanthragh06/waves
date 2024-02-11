const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/sequelize");
const User = require("../models/user");

const Following = sequelize.define("Following", {
    followerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    followingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
});

Following.belongsTo(User, { foreignKey: "followerId", as: "follower" });
Following.belongsTo(User, { foreignKey: "followingId", as: "following" });

module.exports = Following;
