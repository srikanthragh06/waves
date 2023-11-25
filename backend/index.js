// external imports
const express = require("express");
require("dotenv").config();
const cors = require("cors");

// internal imports
const {
    urlNotFoundHandler,
    globalErrorHandler,
    IncorrectJSONFormatHandler,
} = require("./middlewares/handlers");
const { logRequest } = require("./middlewares/logger");
const { connectMongoDB } = require("./db");
const userRouter = require("./routes/user");

// express object created
const app = express();

// connection to DB
connectMongoDB(process.env.MONGODB_URL);

// json parser for request body
app.use(express.json());

app.use(cors());

// handles incorrect json formats
app.use(IncorrectJSONFormatHandler);

// log requests
app.use(logRequest);

// Main routes
app.use("/user", userRouter);

// handle 404 error requests
app.use("/*", urlNotFoundHandler);

// global error handler
app.use(globalErrorHandler);

// listen on port
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server has started on PORT: ${PORT} :)`);
});
