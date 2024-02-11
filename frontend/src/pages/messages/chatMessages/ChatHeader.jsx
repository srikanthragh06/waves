import React, { useContext } from "react";
import ProfilePic from "../../../components/ProfilePic";
import { AuthContext } from "../../../context/AuthProvider";
import { FaArrowLeft } from "react-icons/fa";
import { ChatContext } from "../../../context/ChatProvider";

export default function ChatHeader() {
    const {
        changeIsChatting,
        currentConversationState,
        currentConversationProfilePicState,
    } = useContext(ChatContext);

    const { userDetailsState } = useContext(AuthContext);

    let chatUsername;

    if (currentConversationState.user1.id === userDetailsState.id) {
        chatUsername = currentConversationState.user2.username;
    } else {
        chatUsername = currentConversationState.user1.username;
    }

    return (
        <div
            className="border-color4 border-b-2 flex items-center w-full space-x-4
                        py-4 px-4"
        >
            <FaArrowLeft
                className="text-2xl hover:opacity-70 transition cursor-pointer"
                onClick={(e) => changeIsChatting(false)}
            />
            <ProfilePic
                className={"sm:w-[80px] sm:h-[80px] w-[60px] h-[60px]"}
                src={currentConversationProfilePicState.pic}
                loadingState={currentConversationProfilePicState.isPending}
            />
            <div
                className="text-white w-full border- flex justify-start items-center
                             sm:text-2xl text-lg px-10"
            >
                <p>{chatUsername}</p>
            </div>
        </div>
    );
}
