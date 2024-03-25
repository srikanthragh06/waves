const { consoleLogYellow, consoleLogRed } = require("../utils/colorLogging");
const { logSocket } = require("../utils/logging");

const handleSocketConnection = (io, socket, users) => {
    consoleLogYellow(`User ${socket.id} connected!`);
    logSocket(`User ${socket.id} connected!`);

    // Add user
    const addUser = (users, userId, socketId) => {
        if (!users.has(userId)) {
            users.set(userId, { userId, socketId });
            consoleLogYellow(`User:${userId} added!`);
            logSocket(`User:${userId} added!`);
        }
    };

    // Remove user
    const removeUser = (users, socketId) => {
        for (const [userId, user] of users.entries()) {
            if (user.socketId === socketId) {
                users.delete(userId);
                consoleLogYellow(`User:${userId} removed!`);
                logSocket(`User:${userId} removed!`);
                break;
            }
        }
    };

    // Get user by userId
    const getUser = (users, userId) => {
        return users.get(userId);
    };

    // Add event listener for "addUser" event
    socket.on("addUser", (userId) => {
        addUser(users, userId, socket.id);
        consoleLogYellow("users", users);
    });

    // Handle "sendMessage" event
    socket.on(
        "sendMessage",
        ({ senderId, conversationId, conversationUsers, message }) => {
            try {
                conversationUsers.forEach((userId) => {
                    if (userId !== senderId) {
                        const user = getUser(users, userId);
                        if (!user) return;

                        io.to(user?.socketId).emit("getMessage", {
                            message,
                            conversationId,
                        });
                        consoleLogYellow(
                            `User:${senderId} sent a message to User:${userId}`
                        );
                        logSocket(
                            `User:${senderId} sent a message to User:${userId}`
                        );
                    }
                });
            } catch (err) {
                consoleLogRed(err);
                logSocket(err);
            }
        }
    );

    // Handle "disconnect" event
    socket.on("disconnect", () => {
        consoleLogYellow(`User ${socket.id} disconnected!`);
        logSocket(`User ${socket.id} disconnected!`);
        removeUser(users, socket.id);
    });

    // Handle "reconnect" event
    socket.on("reconnect", () => {
        consoleLogYellow(`User ${socket.id} reconnected!`);
        logSocket(`User ${socket.id} reconnected!`);
    });
};

module.exports = { handleSocketConnection };
