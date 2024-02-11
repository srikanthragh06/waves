const jwt = require("jsonwebtoken");

const { sendClientSideError } = require("../utils/response-templates");
const User = require("../models/user");

exports.isAuth = async (req, res, next) => {
    try {
        const token = req.headers?.authorization;
        if (!token) return sendClientSideError(req, res, "Auth-token missing");
        const jwtToken = token.split("Bearer ")[1];

        if (!jwtToken)
            return sendClientSideError(req, res, "Auth-token missing");

        let decodedToken;
        try {
            decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRET);
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                // Handle TokenExpiredError
                return sendClientSideError(
                    req,
                    res,
                    "token expired, please login again"
                );
            } else {
                throw error; // Throw other errors for general error handling
            }
        }

        const { userId } = decodedToken;

        const user = await User.findByPk(userId);
        if (!user)
            return sendClientSideError(
                req,
                res,
                "Invalid auth-token, user not found"
            );

        req.user = user;
        return next();
    } catch (err) {
        next(err);
    }
};
