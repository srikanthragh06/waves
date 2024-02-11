const express = require("express");
const { isAuth } = require("../middlewares/auth");
const {
    createPostHandler,
    getUserPostsHandler,
    deletePostHandler,
    getPostMediaHandler,
    likePostHandler,
    dislikePostHandler,
    userLikesPostHandler,
    getPostDetailsHandler,
    getFeedPostsHandler,
} = require("../controllers/post");
const { uploadPostMediaFile } = require("../utils/upload");
const { createPostValidation } = require("../middlewares/post");
const router = express.Router();

router
    .route("/create-post")
    .post(
        isAuth,
        uploadPostMediaFile.single("media"),
        createPostValidation,
        createPostHandler
    );

router.route("/delete-post/:postId").delete(isAuth, deletePostHandler);

router.route("/get-post-media/:postId").get(getPostMediaHandler);

router.route("/get-user-posts/:userId").get(getUserPostsHandler);

router.route("/get-post-details/:postId").get(getPostDetailsHandler);

router.route("/like-post").post(isAuth, likePostHandler);

router.route("/dislike-post").post(isAuth, dislikePostHandler);

router.route("/user-likes-post/:userId/:postId").get(userLikesPostHandler);

router.route("/get-feed-posts/:userId").get(getFeedPostsHandler);

module.exports = router;
