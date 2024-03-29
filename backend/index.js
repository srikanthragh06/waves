// external imports
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");

// internal imports
const {
    urlNotFoundHandler,
    globalErrorHandler,
    IncorrectJSONFormatHandler,
} = require("./middlewares/handlers");
const { logRequest } = require("./middlewares/logger");
const { connectPostGres } = require("./db/sequelize");
const userRouter = require("./routes/user");
const followingRouter = require("./routes/following");
const conversationRouter = require("./routes/conversation");
const messageRouter = require("./routes/message");
const postRouter = require("./routes/post");
const commentRouter = require("./routes/comment");
const { consoleLogCyan } = require("./utils/colorLogging");
const { handleSocketConnection } = require("./controllers/socket");

// express object created
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

const users = new Map();
io.on("connection", (socket) => handleSocketConnection(io, socket, users));

// connection to DB
connectPostGres();

// json parser for request body
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

// handles incorrect json formats
app.use(IncorrectJSONFormatHandler);

// log requests
app.use(logRequest);

// Main routes
app.use("/api/user", userRouter);
app.use("/api/following", followingRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/message", messageRouter);
app.use("/api/post", postRouter);
app.use("/api/comment", commentRouter);

// handle 404 error requests
app.use("/*", urlNotFoundHandler);

// global error handler
app.use(globalErrorHandler);

// listen on port
const PORT = process.env.PORT;
server.listen(PORT, () => {
    consoleLogCyan(`Server has started on PORT: ${PORT} :)`);
});
