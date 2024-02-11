const express = require("express");
const {
    getPostCommentsHandler,
    addCommentHandler,
    deleteCommentHandler,
} = require("../controllers/comment");
const { isAuth } = require("../middlewares/auth");
const { addCommentValidation } = require("../middlewares/comment");

const router = express.Router();

router.route("/get-post-comments/:postId").get(getPostCommentsHandler);

router
    .route("/add-comment")
    .post(isAuth, addCommentValidation, addCommentHandler);

router.route("/delete-comment/:commentId").delete(isAuth, deleteCommentHandler);

module.exports = router;
