const express = require("express");
const {
    createConversationHandler,
    getUserConversationsHandler,
} = require("../controllers/conversation");

const { isAuth } = require("../middlewares/auth");

const router = express.Router();

router.route("/create-conversation").post(isAuth, createConversationHandler);

router
    .route("/get-user-conversations")
    .get(isAuth, getUserConversationsHandler);

module.exports = router;
