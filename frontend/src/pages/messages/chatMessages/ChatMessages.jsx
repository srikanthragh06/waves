import React, { useContext, useEffect, useRef, useState } from "react";
import { getConversationMessagesApi } from "../../../api/messages";
import { getAuthToken } from "../../../utils/token";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import MessageItem from "./MessageItem";
import useInvertedInfiniteScroll from "../../../hooks/userInvertedInfiniteScroll";
import { AuthContext } from "../../../context/AuthProvider";
import { ChatContext } from "../../../context/ChatProvider";

export default function ChatMessages() {
    const {
        currentConversationState,
        messagesState,
        setMessagesState,
        setConversationsState,
        limitState,
    } = useContext(ChatContext);

    const { userDetailsState } = useContext(AuthContext);

    const [pageNumberState, setPageNumberState] = useState(1);
    const hasMoreRef = useRef(true);

    const [loadingState, setLoadingState] = useState(false);
    const [errorState, setErrorState] = useState("");

    const scrollRef = useRef();

    useEffect(() => {
        setConversationsState((prev) => {
            return prev.map((conversation) => {
                if (conversation.id === currentConversationState.id) {
                    if (conversation.userId1 === userDetailsState.id) {
                        return { ...conversation, userId1IsRead: true };
                    } else {
                        return { ...conversation, userId2IsRead: true };
                    }
                }
                return { ...conversation };
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const setMessages = async () => {
            setLoadingState(true);

            if (pageNumberState === 1) {
                setMessagesState([]);
                try {
                    const token = getAuthToken();
                    var res = await getConversationMessagesApi(
                        token,
                        currentConversationState.id,
                        pageNumberState,
                        limitState
                    );
                    if (!res.data.error) {
                        setErrorState("");
                        setMessagesState([...res.data.messages]);
                        if (res.data.messages.length < limitState) {
                            hasMoreRef.current = false;
                        } else {
                        }
                        hasMoreRef.current = true;
                    } else {
                        setErrorState(res.data.error);
                    }
                } catch (err) {
                } finally {
                    setLoadingState(false);
                }
            }
        };
        if (currentConversationState.id) setMessages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNumberState, currentConversationState.id]);

    useEffect(() => {
        const setMoreMessages = async () => {
            setLoadingState(true);

            if (pageNumberState > 1) {
                try {
                    const token = getAuthToken();
                    var res = await getConversationMessagesApi(
                        token,
                        currentConversationState.id,
                        pageNumberState,
                        limitState
                    );
                    if (!res.data.error) {
                        setErrorState("");
                        setMessagesState((prev) => [
                            ...prev,
                            ...res.data.messages,
                        ]);

                        if (res.data.messages.length < limitState)
                            hasMoreRef.current = false;
                    } else {
                        setErrorState(res.data.error);
                    }
                } catch (err) {
                } finally {
                    setLoadingState(false);
                }
            }
        };
        if (currentConversationState.id) setMoreMessages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNumberState, currentConversationState.id]);

    useInvertedInfiniteScroll(
        scrollRef,
        () => setPageNumberState((prev) => prev + 1),
        loadingState,
        hasMoreRef.current
    );

    return (
        <div
            ref={scrollRef}
            className="overflow-y-scroll w-full h-full 
        flex flex-col-reverse space-y-reverse space-y-2 py-4 px-2 
        border-"
        >
            {errorState && <p className="text-red-600">{errorState}</p>}
            {loadingState && (
                <AiOutlineLoading3Quarters className="animate-spin text-3xl" />
            )}
            {messagesState.map((message) => {
                return <MessageItem key={message.id} message={message} />;
            })}
        </div>
    );
}
