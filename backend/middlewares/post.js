const { body, validationResult } = require("express-validator");
const { sendClientSideError } = require("../utils/response-templates");

exports.createPostValidation = [
    body("content")
        .notEmpty()
        .withMessage("Content is required.")
        .isLength({ min: 0, max: 800 })
        .withMessage("Content must be between 0 and 800 characters."),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendClientSideError(req, res, errors.array()[0].msg);
        }
        next();
    },
];
