const { sequelize } = require("../db/sequelize");
const Comment = require("../models/comment");
const Post = require("../models/post");
const User = require("../models/user");
const {
    sendClientSideError,
    sendSuccessResponse,
} = require("../utils/response-templates");

exports.getPostCommentsHandler = async (req, res, next) => {
    try {
        const { postId } = req.params;
        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page, 10);
        limit = parseInt(limit, 10);
        const offset = (page - 1) * limit;

        await sequelize.transaction(async (t) => {
            const post = await Post.findByPk(postId, { transaction: t });

            if (!post)
                return sendClientSideError(
                    req,
                    res,
                    "Post with this postId doesnt exist"
                );

            const comments = await Comment.findAll({
                where: { postId },
                attributes: [
                    "id",
                    "replyCommentId",
                    "postId",
                    "content",
                    "createdAt",
                ],
                include: [
                    {
                        model: User,
                        as: "user",
                        attributes: ["id", "username"],
                    },
                    {
                        model: Comment,
                        as: "replyComment",
                        attributes: [
                            "id",
                            "replyCommentId",
                            "postId",
                            "content",
                            "createdAt",
                        ],
                        include: [
                            {
                                model: User,
                                as: "user",
                                attributes: ["id", "username"],
                            },
                        ],
                    },
                ],
                order: [["createdAt", "DESC"]],
                limit,
                offset,
                transaction: t,
            });

            return sendSuccessResponse(
                req,
                res,
                "Comments successfully retreived",
                200,
                { comments }
            );
        });
    } catch (err) {
        next(err);
    }
};

exports.addCommentHandler = async (req, res, next) => {
    try {
        const { postId, replyCommentId, content } = req.body;

        const userId = req.user?.id;

        if (!postId) return sendClientSideError(req, res, "Missing postId");
        if (!content) return sendClientSideError(req, res, "Missing content");

        await sequelize.transaction(async (t) => {
            const createdComment = await Comment.create(
                {
                    postId,
                    userId,
                    content,
                    replyCommentId,
                },
                { transaction: t }
            );

            let replyComment = null;
            if (replyCommentId) {
                replyComment = await Comment.findOne({
                    where: { id: replyCommentId },
                    attributes: ["id", "postId", "content", "createdAt"],
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: ["id", "username"],
                        },
                    ],
                    transaction: t,
                });
            }

            await Post.increment("comments", {
                by: 1,
                where: { id: postId },
                transaction: t,
            });

            return sendSuccessResponse(
                req,
                res,
                "Comment created successfully",
                200,
                {
                    comment: {
                        ...createdComment.toJSON(),
                        user: req.user,
                        replyComment: replyComment
                            ? replyComment.toJSON()
                            : null,
                    },
                }
            );
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteCommentHandler = async (req, res, next) => {
    try {
        const { commentId } = req.params;

        await sequelize.transaction(async (t) => {
            const comment = await Comment.findByPk(commentId, {
                transaction: t,
            });
            if (!comment)
                return sendClientSideError(
                    req,
                    res,
                    "Comment with this comment id doesnt exist"
                );

            const numDeletedReplies = await Comment.destroy({
                where: { replyCommentId: commentId },
                transaction: t,
            });

            await Comment.destroy({
                where: { id: commentId },
                transaction: t,
            });

            await Post.decrement("comments", {
                by: 1 + numDeletedReplies,
                where: { id: comment.postId },
                transaction: t,
            });

            return sendSuccessResponse(
                req,
                res,
                "Comment deleted successfully"
            );
        });
    } catch (err) {
        next(err);
    }
};
