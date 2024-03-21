import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { AuthContext } from "./AuthProvider";
import { getAuthToken } from "../utils/token";
import { addMessageApi, deleteMessageApi, setIsReadApi } from "../api/messages";
import io from "socket.io-client";
import useWebSocket from "../hooks/useWebSocket";
import useAddUserEffect from "../hooks/useAddUserEffect";
import useGetMessageSocket from "../hooks/useGetMessageSocket";

export const ChatContext = createContext();

export default function ChatProvider({ children }) {
    const { userDetailsState } = useContext(AuthContext);

    const [replyingMessageState, setReplyingMessageState] = useState({});

    const [isChattingState, setIsChattingState] = useState(false);
    const IsChattingRef = useRef(isChattingState);
    const changeIsChatting = (value) => {
        setIsChattingState(value);
        IsChattingRef.current = value;
    };

    const [conversationsState, setConversationsState] = useState([]);

    const [currentConversationState, setCurrentConversationState] = useState(
        {}
    );
    const currentConversationRef = useRef(currentConversationState);
    const changeCurrentConversation = (value) => {
        setCurrentConversationState(value);
        currentConversationRef.current = value;
    };

    const [
        currentConversationProfilePicState,
        setCurrentConversationProfilePicState,
    ] = useState({ pic: null, isPending: false, error: "" });

    const [messagesState, setMessagesState] = useState([]);

    const [limitState, setLimitState] = useState(10);

    const doAfterMessageUpdates = (message, conversationId) => {
        if (currentConversationRef.current?.id === conversationId) {
            setMessagesState((prev) => [message, ...prev]);
        }
        setConversationsState((prev) => {
            return prev.map((conversation) => {
                if (conversation.id === conversationId) {
                    conversation.lastMessage = message.content;

                    if (!IsChattingRef.current) {
                        if (conversation.userId1 === userDetailsState.id) {
                            conversation.userId1IsRead = false;
                        } else {
                            conversation.userId2IsRead = false;
                        }
                    }
                }

                return conversation;
            });
        });
        setLimitState((prev) => prev + 1);
        setConversationsState((prev) => {
            const index = prev.findIndex(
                (conversation) => conversation.id === conversationId
            );

            if (index !== -1) {
                const pickedItem = prev.splice(index, 1)[0];
                prev.unshift(pickedItem);
            }
            return prev;
        });
    };

    const sendMessage = async (
        conversationId,
        content,
        media = null,
        users = [],
        okCallback = () => {},
        errorCallback = () => {},
        replyMessageId
    ) => {
        const formData = new FormData();
        formData.append("conversationId", conversationId);
        if (!media) {
            formData.append("content", content);
        } else {
            formData.append("media", media);
        }
        if (replyMessageId) {
            formData.append("replyMessageId", replyMessageId);
        }

        const token = getAuthToken();
        const res = await addMessageApi(token, formData);
        if (!res.data.error) {
            doAfterMessageUpdates(res.data.message, conversationId);
            okCallback();

            if (socket.current) {
                socket.current.emit("sendMessage", {
                    senderId: userDetailsState.id,
                    conversationId,
                    conversationUsers: users,
                    message: res.data.message,
                });
            }

            return true;
        }
        errorCallback();

        return false;
    };

    const handleGetMessage = async ({ conversationId, message }) => {
        doAfterMessageUpdates(message, conversationId);
        const token = getAuthToken();
        await setIsReadApi(token, conversationId);
    };

    const deleteMessage = async (message) => {
        const token = getAuthToken();
        const res = await deleteMessageApi(token, message.id);
        if (!res.data.error) {
            setMessagesState((prev) => {
                return prev.filter((msg) => message.id !== msg.id);
            });
            setLimitState((prev) => prev - 1);
        }
    };

    useEffect(() => {
        setIsChattingState(false);
    }, [userDetailsState.id]);

    const socket = useWebSocket(userDetailsState, handleGetMessage);

    useGetMessageSocket(socket, userDetailsState, handleGetMessage);

    useAddUserEffect(socket, userDetailsState);

    return (
        <ChatContext.Provider
            value={{
                isChattingState,
                setIsChattingState,
                conversationsState,
                setConversationsState,
                currentConversationState,
                setCurrentConversationState,
                currentConversationProfilePicState,
                setCurrentConversationProfilePicState,
                messagesState,
                setMessagesState,
                limitState,
                setLimitState,
                sendMessage,
                changeCurrentConversation,
                changeIsChatting,
                deleteMessage,
                replyingMessageState,
                setReplyingMessageState,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}
