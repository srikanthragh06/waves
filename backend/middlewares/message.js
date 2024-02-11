const { body, validationResult } = require("express-validator");
const { sendClientSideError } = require("../utils/response-templates");
const path = require("path");
const { deleteFile } = require("../utils/utils");

exports.addMessageValidation = [
    body("conversationId")
        .notEmpty()
        .withMessage("Conversation ID is required.")
        .isInt({ min: 1 })
        .withMessage("Conversation ID must be a valid integer."),
    body("content")
        .optional({ nullable: true })
        .isLength({ min: 0, max: 1500 })
        .withMessage("Content must be between 0 and 1500 characters."),
    body("postId")
        .optional({ nullable: true })
        .isInt({ min: 1 })
        .withMessage("Post ID must be a valid integer."),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.file) {
                const mediaPath = path.join(
                    __dirname,
                    "..",
                    "media",
                    "messages",
                    `${req.file.filename}`
                );
                deleteFile(mediaPath);
            }
            return sendClientSideError(req, res, errors.array()[0].msg);
        }
        if (
            [req.body.postId, req.file, req.body.content].filter(Boolean)
                .length !== 1
        ) {
            if (req.file) {
                const mediaPath = path.join(
                    __dirname,
                    "..",
                    "media",
                    "messages",
                    `${req.file.filename}`
                );
                deleteFile(mediaPath);
            }

            return sendClientSideError(
                req,
                res,
                "Exactly one of postId, mediaFileName, content must be not null."
            );
        }
        next();
    },
];
