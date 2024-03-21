import { useEffect } from "react";

const useGetMessageSocket = (socket, userDetailsState, handleGetMessage) => {
    useEffect(() => {
        if (socket.current && userDetailsState?.id) {
            socket.current.on("getMessage", handleGetMessage);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, userDetailsState?.id]);
};

export default useGetMessageSocket;
