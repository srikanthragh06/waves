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
        const { userId } = jwt.verify(jwtToken, process.env.JWT_SECRET);

        const user = await User.findById(userId);
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
