const Joi = require("joi");
const { body, validationResult } = require("express-validator");
const { sendClientSideError } = require("../utils/response-templates");

exports.signupValidation = [
    body("user.username")
        .matches(/^[a-zA-Z0-9_]{4,32}$/)
        .withMessage("Incorrect username format"),
    body("user.password")
        .isLength({ min: 6, max: 32 })
        .withMessage("Incorrect password format"),
    body("user.email").isEmail().withMessage("Incorrect email format"),
    body("user.dateOfBirth")
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage("Incorrect dateOfBirth format"),
    body("user.gender")
        .isIn(["Male", "Female", "Others"])
        .withMessage("Incorrect gender format"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendClientSideError(req, res, errors.array()[0].msg);
        }
        next();
    },
];

exports.loginValidation = [
    body("user.username")
        .if(body("user.email").not().exists()) // Either username or email has to be present
        .exists({ checkFalsy: true, checkNull: true })
        .isString()
        .isLength({ min: 4, max: 32 })
        .trim()
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage("Invalid username format"),
    body("user.email")
        .if(body("user.username").not().exists()) // Either username or email has to be present
        .exists({ checkFalsy: true, checkNull: true })
        .isString()
        .isEmail()
        .trim()
        .withMessage("Invalid email format"),
    body("user.password")
        .isString()
        .isLength({ min: 6, max: 32 })
        .withMessage("Invalid password format"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendClientSideError(req, res, errors.array()[0].msg);
        }
        next();
    },
];

exports.updateUserValidation = [
    body("user.username")
        .optional()
        .matches(/^.{4,32}$/)
        .withMessage("Username must be 4-32 characters")
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage(
            "username only allows alphanumeric characters and underscores"
        ),
    body("user.dateOfBirth")
        .optional()
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage("Incorrect dateOfBirth format (yyyy-mm-dd)"),
    body("user.bio")
        .optional()
        .isLength({ min: 0, max: 200 })
        .withMessage("Bio must be between 0 and 200 characters"),
    body("user.gender")
        .optional()
        .isIn(["Male", "Female", "Others"])
        .withMessage("Gender can be only Male,Female or Others"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendClientSideError(req, res, errors.array()[0].msg);
        }
        next();
    },
];
