const { sequelize } = require("../db/sequelize");
const Post = require("../models/post");
const User = require("../models/user");
const Like = require("../models/like");
const Following = require("../models/following");
const {
    sendClientSideError,
    sendSuccessResponse,
    sendFileResponse,
} = require("../utils/response-templates");
const { deleteFile, doesFileExist } = require("../utils/utils");
const path = require("path");
const Dislike = require("../models/dislike");
const Comment = require("../models/comment");

exports.createPostHandler = async (req, res, next) => {
    try {
        const creatorId = req.user?.id;
        const { content } = req.body;

        if (!content) {
            return sendClientSideError(req, res, "Content is missing!");
        }

        if (req.error) {
            return sendClientSideError(req, res, req.error);
        }

        await sequelize.transaction(async (t) => {
            const postDetails = {
                content,
                userId: creatorId,
            };
            if (req.file) {
                postDetails.mediaFileName = req.file?.filename;
            }

            const newPost = await Post.create(postDetails, { transaction: t });

            await User.increment("posts", {
                by: 1,
                where: { id: creatorId },
                transaction: t,
            });

            return sendSuccessResponse(
                req,
                res,
                "Post created successfully",
                200,
                { userId: creatorId, content }
            );
        });
    } catch (err) {
        next(err);
    }
};

exports.deletePostHandler = async (req, res, next) => {
    try {
        const deleterId = req.user?.id;
        const { postId } = req.params;

        await sequelize.transaction(async (t) => {
            const post = await Post.findByPk(postId, { transaction: t });

            if (!post)
                return sendClientSideError(
                    req,
                    res,
                    "Post with this postId does not exist!"
                );

            if (post.userId !== deleterId) {
                return sendClientSideError(
                    req,
                    res,
                    `The deleter of the post did not create this post!`
                );
            }

            if (post.mediaFileName) {
                const mediaPath = path.join(
                    __dirname,
                    "..",
                    "media",
                    "posts",
                    `${post.mediaFileName}`
                );
                const fileDeleted = await deleteFile(mediaPath);
                if (!fileDeleted) {
                    return sendClientSideError(
                        req,
                        res,
                        "Could not delete post media!"
                    );
                }
            }

            await Comment.destroy({
                where: { postId: post.id },
                transaction: t,
            });

            await Like.destroy({
                where: { postId: post.id },
                transaction: t,
            });

            await Dislike.destroy({
                where: { postId: post.id },
                transaction: t,
            });

            await Post.destroy({ where: { id: post.id }, transaction: t });

            await User.decrement("posts", {
                by: 1,
                where: { id: deleterId },
                transaction: t,
            });

            return sendSuccessResponse(
                req,
                res,
                `post:${post.id} successfully deleted`
            );
        });
    } catch (err) {
        next(err);
    }
};

exports.getPostMediaHandler = async (req, res, next) => {
    try {
        const { postId } = req.params;

        await sequelize.transaction(async (t) => {
            const post = await Post.findByPk(postId, { transaction: t });
            if (!post)
                return sendClientSideError(
                    req,
                    res,
                    "Post with this post id doesnt exist!"
                );

            if (!post.mediaFileName)
                return sendClientSideError(
                    req,
                    res,
                    "This post doesnt have any images or videos"
                );

            const mediaPath = path.join(
                __dirname,
                "..",
                "media",
                "posts",
                `${String(post.mediaFileName)}`
            );
            const fileExists = await doesFileExist(mediaPath);
            if (!fileExists)
                return sendClientSideError(
                    req,
                    res,
                    "post media file doesnt exist"
                );

            return sendFileResponse(req, res, mediaPath);
        });
    } catch (err) {
        next(err);
    }
};

exports.getUserPostsHandler = async (req, res, next) => {
    try {
        const { userId } = req.params;
        let { page = 1, limit = 3 } = req.query;
        page = parseInt(page, 10);
        limit = parseInt(limit, 10);
        const offset = (page - 1) * limit;

        await sequelize.transaction(async (t) => {
            const user = await User.findByPk(userId, { transaction: t });
            if (!user)
                return sendClientSideError(
                    req,
                    res,
                    "User with this userId does not exist!"
                );

            const posts = await Post.findAll({
                where: {
                    userId,
                },
                attributes: [
                    "id",
                    // "content",
                    // "likes",
                    // "dislikes",
                    // "comments",
                    // "createdAt",
                    // "updatedAt",
                    // "mediaFileName",
                ],
                order: [["createdAt", "DESC"]],
                limit,
                offset,
                transaction: t,
            });

            return sendSuccessResponse(
                req,
                res,
                `Posts of user:${userId} retreived successfully`,
                200,
                {
                    posts,
                }
            );
        });
    } catch (err) {
        next(err);
    }
};

exports.getPostDetailsHandler = async (req, res, next) => {
    try {
        const { postId } = req.params;
        if (!postId)
            return sendClientSideError(
                req,
                res,
                "Missing postId request parameter"
            );

        await sequelize.transaction(async (t) => {
            const post = await Post.findOne({
                where: { id: postId },
                attributes: [
                    "id",
                    "content",
                    "likes",
                    "dislikes",
                    "comments",
                    "userId",
                    "createdAt",
                    "mediaFileName",
                ],
                include: [
                    {
                        model: User,
                        attributes: ["id", "username"],
                    },
                ],
                transaction: t,
            });
            if (!post)
                return sendClientSideError(
                    req,
                    res,
                    "Post with this postId doesnt exist"
                );

            return sendSuccessResponse(
                req,
                res,
                "Post details retreived successfully",
                200,
                { post }
            );
        });
    } catch (err) {
        next(err);
    }
};

exports.likePostHandler = async (req, res, next) => {
    try {
        const likerId = req.user?.id;

        const { postId } = req.body;
        if (!postId) return sendClientSideError(req, res, "Missing postId");

        await sequelize.transaction(async (t) => {
            const post = await Post.findByPk(postId, { transaction: t });
            if (!post)
                return sendClientSideError(
                    req,
                    res,
                    `Post with postid:${postId} does not exist!`
                );

            const likeDetails = { userId: likerId, postId: post.id };
            const like = await Like.findOne({
                where: likeDetails,
                transaction: t,
            });
            if (!like) {
                const newLike = await Like.create(likeDetails, {
                    transaction: t,
                });

                await Post.increment("likes", {
                    by: 1,
                    where: { id: postId },
                    transaction: t,
                });

                return sendSuccessResponse(
                    req,
                    res,
                    "Post liked successfully!",
                    200,
                    {
                        isLiked: true,
                    }
                );
            } else {
                await Like.destroy({ where: likeDetails }, { transaction: t });

                await Post.decrement("likes", {
                    by: 1,
                    where: { id: postId },
                    transaction: t,
                });

                return sendSuccessResponse(
                    req,
                    res,
                    "Post unliked successfully!",
                    200,
                    {
                        isLiked: false,
                    }
                );
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.dislikePostHandler = async (req, res, next) => {
    try {
        const dislikerId = req.user?.id;

        const { postId } = req.body;
        if (!postId) return sendClientSideError(req, res, "Missing postId");

        await sequelize.transaction(async (t) => {
            const post = await Post.findByPk(postId, { transaction: t });
            if (!post)
                return sendClientSideError(
                    req,
                    res,
                    `Post with postid:${postId} does not exist!`
                );

            const dislikeDetails = { userId: dislikerId, postId: post.id };
            const dislike = await Dislike.findOne({
                where: dislikeDetails,
                transaction: t,
            });
            if (!dislike) {
                const newDisLike = await Dislike.create(dislikeDetails, {
                    transaction: t,
                });

                await Post.increment("dislikes", {
                    by: 1,
                    where: { id: postId },
                    transaction: t,
                });

                return sendSuccessResponse(
                    req,
                    res,
                    "Post disliked successfully!",
                    200,
                    {
                        isDisliked: true,
                    }
                );
            } else {
                await Dislike.destroy(
                    { where: dislikeDetails },
                    { transaction: t }
                );

                await Post.decrement("dislikes", {
                    by: 1,
                    where: { id: postId },
                    transaction: t,
                });

                return sendSuccessResponse(
                    req,
                    res,
                    "Post undisliked successfully!",
                    200,
                    {
                        isDisliked: false,
                    }
                );
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.userLikesPostHandler = async (req, res, next) => {
    try {
        const { userId, postId } = req.params;
        if (!userId)
            return sendClientSideError(
                req,
                res,
                "Missing userId request parameter"
            );
        if (!postId)
            return sendClientSideError(
                req,
                res,
                "Missing postId request parameter"
            );

        await sequelize.transaction(async (t) => {
            const likeExists = await Like.findOne({
                where: { userId, postId },
                transaction: t,
            });

            const dislikeExists = await Dislike.findOne({
                where: { userId, postId },
                transaction: t,
            });

            return sendSuccessResponse(
                req,
                res,
                `Like status retreived successfully`,
                200,
                { likeExists, dislikeExists }
            );
        });
    } catch (err) {
        next(err);
    }
};

exports.getFeedPostsHandler = async (req, res, next) => {
    try {
        const { userId } = req.params;
        if (!userId)
            return sendClientSideError(
                req,
                res,
                "Missing userId request parameter"
            );

        let { page = 1, limit = 5 } = req.query;
        page = parseInt(page, 10);
        limit = parseInt(limit, 10);
        const offset = (page - 1) * limit;

        await sequelize.transaction(async (t) => {
            const followingUsers = await Following.findAll({
                where: { followerId: userId },
                attributes: ["followingId"],
                transaction: t,
                raw: true,
            });

            let followingUsersIds = followingUsers.map(
                (follow) => follow.followingId
            );
            followingUsersIds.push(userId);

            const posts = await Post.findAll({
                where: { userId: followingUsersIds },
                attributes: ["id"],
                order: [["createdAt", "DESC"]],
                limit,
                offset,
                transaction: t,
            });

            return sendSuccessResponse(
                req,
                res,
                "Feed posts fetched successfully",
                200,
                { posts }
            );
        });
    } catch (err) {
        next(err);
    }
};
