import React from "react";
import ChatPeople from "./conversations/ChatPeople";
import ChatBox from "./chatMessages/ChatBox";

export default function Messages() {
    return (
        <>
            <ChatPeople />
            <ChatBox />
        </>
    );
}
