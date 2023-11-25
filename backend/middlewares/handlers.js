const {
    sendServerSideError,
    sendClientSideError,
} = require("../utils/response-templates");

exports.urlNotFoundHandler = (req, res) => {
    return sendClientSideError(req, res, "404 Not Found", 404);
};

exports.globalErrorHandler = (err, req, res, next) => {
    console.error(err);
    return sendServerSideError(req, res);
};

exports.IncorrectJSONFormatHandler = (err, req, res, next) => {
    if (err instanceof SyntaxError) {
        return sendClientSideError(req, res, "Invalid JSON Format");
    } else {
        next();
    }
};
