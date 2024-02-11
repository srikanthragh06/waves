const express = require("express");
const {
    addMessageHandler,
    getConversationMessagesHandler,
    setIsReadHandler,
    deleteMessageHandler,
    getMessageMediaHandler,
} = require("../controllers/message");
const { isAuth } = require("../middlewares/auth");
const { addMessageValidation } = require("../middlewares/message");
const { uploadMessageMediaFile } = require("../utils/upload");

const router = express.Router();

//add
router
    .route("/add-message")
    .post(
        isAuth,
        uploadMessageMediaFile.single("media"),
        addMessageValidation,
        addMessageHandler
    );

//get
router
    .route("/get-conversation-messages/:conversationId")
    .get(isAuth, getConversationMessagesHandler);

router.route("/set-is-read").patch(isAuth, setIsReadHandler);

router.route("/delete-message/:messageId").delete(isAuth, deleteMessageHandler);

router
    .route("/get-message-media/:messageId")
    .get(isAuth, getMessageMediaHandler);

module.exports = router;
