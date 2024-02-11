const { exist } = require("joi");
const { sequelize } = require("../db/sequelize");
const Following = require("../models/following");
const User = require("../models/user");
const {
    sendClientSideError,
    sendSuccessResponse,
} = require("../utils/response-templates");
const { Op } = require("sequelize");

exports.followUserHandler = async (req, res, next) => {
    try {
        const followerId = req.user?.id;
        const { followingId } = req.body;

        if (!followingId)
            return sendClientSideError(req, res, "No following id");

        if (followerId === followingId)
            return sendClientSideError(req, res, "You cannot follow yourself");

        await sequelize.transaction(async (t) => {
            const existingFollow = await Following.findOne({
                where: {
                    followerId,
                    followingId,
                },
                transaction: t,
            });

            if (existingFollow)
                return sendClientSideError(
                    req,
                    res,
                    "follower already following this user"
                );

            await Following.create(
                { followerId, followingId },
                { transaction: t }
            );

            await User.increment("followers", {
                by: 1,
                where: { id: followingId },
                transaction: t,
            });

            await User.increment("following", {
                by: 1,
                where: { id: followerId },
                transaction: t,
            });

            sendSuccessResponse(req, res, "follow successfully executed");
        });
    } catch (err) {
        next(err);
    }
};

exports.unfollowUserHandler = async (req, res, next) => {
    try {
        const followerId = req.user?.id;
        const { followingId } = req.body;

        if (!followingId)
            return sendClientSideError(req, res, "No following id");

        if (followerId === followingId)
            return sendClientSideError(
                req,
                res,
                "You cannot unfollow yourself"
            );

        await sequelize.transaction(async (t) => {
            const existingFollow = await Following.findOne({
                where: {
                    followerId,
                    followingId,
                },
                transaction: t,
            });

            if (!existingFollow) {
                return sendClientSideError(
                    req,
                    res,
                    "FollowerId doesnt follow followingId"
                );
            }

            await existingFollow.destroy({
                transaction: t,
            });

            await User.decrement("followers", {
                by: 1,
                where: { id: followingId },
                transaction: t,
            });

            await User.decrement("following", {
                by: 1,
                where: { id: followerId },
                transaction: t,
            });

            sendSuccessResponse(req, res, "Unfollow successfully executed");
        });
    } catch (err) {
        next(err);
    }
};

exports.isFollowingHandler = async (req, res, next) => {
    try {
        let { followerId, followingId } = req.params;
        console.log({ followerId, followingId });
        if (!followerId)
            return sendClientSideError(
                req,
                res,
                "Missing followerId parameter"
            );

        if (!followingId)
            return sendClientSideError(
                req,
                res,
                "Missing followingId parameter"
            );

        await sequelize.transaction(async (t) => {
            const following = await Following.findOne({
                where: { followerId, followingId },
                transaction: t,
            });

            if (!following)
                return sendSuccessResponse(
                    req,
                    res,
                    `user:${followerId} doesnt follow user:${followingId}`,
                    200,
                    { isFollowing: false }
                );
            else
                return sendSuccessResponse(
                    req,
                    res,
                    `user:${followerId} follows user:${followingId}`,
                    200,
                    { isFollowing: true }
                );
        });
    } catch (err) {
        next(err);
    }
};

exports.searchUserFollowersHandler = async (req, res, next) => {
    try {
        const { userId } = req.params;
        if (!userId) return sendClientSideError(req, res, "No userId");

        let { searchKey, page = 1, limit = 10 } = req.query;
        page = parseInt(page, 10);
        limit = parseInt(limit, 10);
        const offset = (page - 1) * limit;

        const usernameCondition = searchKey
            ? {
                  username: {
                      [Op.iLike]: `%${searchKey.toLowerCase()}%`, // Using Op.iLike for case-insensitive search
                  },
              }
            : {};

        await sequelize.transaction(async (t) => {
            const userFollowers = await Following.findAndCountAll({
                where: { followingId: userId },
                include: [
                    { model: User, as: "follower", where: usernameCondition },
                ],
                limit: limit,
                offset: offset,
                transaction: t,
            });

            const followersList = userFollowers.rows.map((follower) => {
                return {
                    id: follower.follower.id,
                    username: follower.follower.username,
                    followers: follower.follower.followers,
                    posts: follower.follower.posts,
                };
            });

            return sendSuccessResponse(
                req,
                res,
                "Following List retreived successfully",
                200,
                { users: followersList }
            );
        });
    } catch (err) {
        next(err);
    }
};

exports.searchUserFollowingHandler = async (req, res, next) => {
    try {
        const { userId } = req.params;
        if (!userId) return sendClientSideError(req, res, "No userId");

        let { searchKey, page = 1, limit = 10 } = req.query;
        page = parseInt(page, 10);
        limit = parseInt(limit, 10);
        const offset = (page - 1) * limit;

        const usernameCondition = searchKey
            ? {
                  username: {
                      [Op.iLike]: `%${searchKey.toLowerCase()}%`, // Using Op.iLike for case-insensitive search
                  },
              }
            : {};

        await sequelize.transaction(async (t) => {
            const userFollowers = await Following.findAndCountAll({
                where: { followerId: userId },
                include: [
                    { model: User, as: "following", where: usernameCondition },
                ],
                limit: limit,
                offset: offset,
                transaction: t,
            });

            const followingList = userFollowers.rows.map((following) => {
                return {
                    id: following.following.id,
                    username: following.following.username,
                    followers: following.following.followers,
                    posts: following.following.posts,
                };
            });

            return sendSuccessResponse(
                req,
                res,
                "Following List retreived successfully",
                200,
                { users: followingList }
            );
        });
    } catch (err) {
        next(err);
    }
};
