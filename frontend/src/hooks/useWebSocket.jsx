import { useEffect, useRef } from "react";
import io from "socket.io-client";

const useWebSocket = (userDetailsState) => {
    const socket = useRef(null);

    useEffect(() => {
        if (userDetailsState.id) {
            const socketOrigin =
                process.env.NODE_ENV === "production"
                    ? "/api/"
                    : "ws://localhost:5000";
            socket.current = io(socketOrigin);
        }

        return () => {
            if (socket.current) {
                socket.current.disconnect();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userDetailsState.id]);

    return socket;
};

export default useWebSocket;
