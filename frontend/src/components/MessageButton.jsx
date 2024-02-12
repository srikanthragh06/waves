import React, { useContext } from "react";
import PurpleButton from "./PurpleButton";
import { ChatContext } from "../context/ChatProvider";
import { useNavigate } from "react-router-dom";
import { createConversationApi } from "../api/conversation";
import { getAuthToken } from "../utils/token";
import { getProfilePictureApi } from "../api/user";
import { AuthContext } from "../context/AuthProvider";

export default function MessageButton({ profileId }) {
    const navigate = useNavigate();
    const { userDetailsState } = useContext(AuthContext);

    const {
        changeIsChatting,
        changeCurrentConversation,
        setCurrentConversationProfilePicState,
        setMessagesState,
    } = useContext(ChatContext);

    const handleClick = async (e) => {
        e.preventDefault();

        const token = getAuthToken();
        var res = await createConversationApi(token, profileId);
        changeCurrentConversation(res.data.conversation);

        if (!res.data.error) {
            const receiverId =
                res.data.conversation.userId1 === userDetailsState.id
                    ? res.data.conversation.userId2
                    : res.data.conversation.userId1;

            res = await getProfilePictureApi(receiverId);

            if (!res.error) {
                const picURL = URL.createObjectURL(res);
                setCurrentConversationProfilePicState({
                    pic: picURL,
                    isPending: false,
                    error: "",
                });
            } else {
                setCurrentConversationProfilePicState({
                    pic: null,
                    isPending: false,
                    error: "",
                });
            }

            setMessagesState([]);
            changeIsChatting(true);
            navigate("/messages");
        }
    };

    return (
        <PurpleButton
            className={`text-sm sm:text-lg sm:px-12 px-4 py-0 bg-color3
                    flex justify-center items-center rounded-lg
                    hover:opacity-75`}
            onClick={handleClick}
        >
            Message
        </PurpleButton>
    );
}
