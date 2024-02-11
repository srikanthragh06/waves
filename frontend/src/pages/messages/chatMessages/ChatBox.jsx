import React, { useContext } from "react";
import MainPage from "../../../components/MainPage";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { ChatContext } from "../../../context/ChatProvider";

export default function ChatBox() {
    const { isChattingState, currentConversationState } =
        useContext(ChatContext);

    if (!isChattingState || !currentConversationState?.id) return null;

    return (
        <MainPage
        // style={
        //     !isChattingState || !currentConversationsState
        //         ? { display: "none" }
        //         : {}
        // }
        >
            <ChatHeader />
            <ChatMessages />
            <ChatInput />
        </MainPage>
    );
}
