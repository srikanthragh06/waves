import { useEffect } from "react";

const useAddUserEffect = (socket, userDetailsState) => {
    useEffect(() => {
        if (userDetailsState?.id && socket.current) {
            socket.current.emit("addUser", userDetailsState?.id);
        }
    }, [userDetailsState?.id, socket]);
};

export default useAddUserEffect;
