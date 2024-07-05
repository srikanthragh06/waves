import { useEffect, useRef } from "react";
import io from "socket.io-client";

const useWebSocket = (userDetailsState) => {
    const socket = useRef(null);

    useEffect(() => {
        if (userDetailsState.id) {
            const socketOrigin = process.env.REACT_APP_SOCKET_PATH;
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
