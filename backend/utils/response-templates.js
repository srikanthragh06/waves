const { logResponse } = require("./logging");

exports.sendClientSideError = (
    req,
    res,
    errMsg = "Invalid Request",
    statusCode = 400
) => {
    logResponse(req, errMsg, statusCode);
    return res.status(statusCode).json({ error: errMsg });
};

exports.sendServerSideError = (
    req,
    res,
    errMsg = "Server Side Error",
    statusCode = 500
) => {
    logResponse(req, errMsg, statusCode);
    return res.status(statusCode).json({ error: errMsg });
};

exports.sendSuccessResponse = (
    req,
    res,
    message = "Request Successful",
    statusCode = 200,
    additionals = {}
) => {
    logResponse(req, message, statusCode);
    return res.status(statusCode).json({ message, ...additionals });
};

exports.sendFileResponse = (req, res, path, statusCode = 200) => {
    logResponse(req, `image ${path} sent successfully`, statusCode);
    return res.status(statusCode).sendFile(path);
};
