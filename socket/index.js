const io = require("socket.io");
const dotenv = require("dotenv");
const { logMsg } = require("./utils/logging");

dotenv.config();

const server = io(process.env.PORT, {
    cors: {
        origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    },
});

let users = new Map();

const addUser = (userId, socketId) => {
    if (!users.has(userId)) {
        users.set(userId, { userId, socketId });
        console.log(`User:${userId} added!`);
        logMsg(`User:${userId} added!`);
    }
};

const removeUser = (socketId) => {
    for (const [userId, user] of users.entries()) {
        if (user.socketId === socketId) {
            users.delete(userId);
            console.log(`User:${userId} removed!`);
            logMsg(`User:${userId} removed!`);
            break;
        }
    }
};

const getUser = (userId) => {
    return users.get(userId);
};

server.on("connection", (socket) => {
    // when connect
    console.log(`User ${socket.id} connected!`);
    logMsg(`User ${socket.id} connected!`);

    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        console.log("users", users);
    });

    // send and get msg
    socket.on(
        "sendMessage",
        ({ senderId, conversationId, conversationUsers, message }) =>
            // workedCallback
            {
                try {
                    conversationUsers.forEach((userId) => {
                        if (userId !== senderId) {
                            const user = getUser(userId);
                            if (!user) return;

                            server.to(user?.socketId).emit("getMessage", {
                                message,
                                conversationId,
                            });
                            console.log(
                                `User:${senderId} sent a message to User:${userId}`
                            );
                            logMsg(
                                `User:${senderId} sent a message to User:${userId}`
                            );
                        }
                    });
                    // workedCallback("success");
                } catch (err) {
                    console.error(err);
                    logMsg(err);
                    // workedCallback("failure");
                }
            }
    );

    // when disconnect
    socket.on("disconnect", () => {
        console.log(`User ${socket.id} disconnected!`);
        logMsg(`User ${socket.id} disconnected!`);
        removeUser(socket.id);
        // console.log(users);
    });

    socket.on("reconnect", () => {
        console.log(`User ${socket.id} reconnected!`);
        logMsg(`User ${socket.id} reconnected!`);
        // console.log(users);
    });
});
