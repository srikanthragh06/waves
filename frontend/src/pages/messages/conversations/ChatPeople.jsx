import React, { useContext, useEffect, useRef, useState } from "react";
import MainPage from "../../../components/MainPage";
import { AuthContext } from "../../../context/AuthProvider";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import useInfiniteScroll from "../../../hooks/useInfiteScroll";
import { getUserConversationsApi } from "../../../api/conversation";
import { getAuthToken } from "../../../utils/token";
import ChatUserItem from "./ChatUserItem";
import useStretchDiv from "../../../hooks/useStretchDiv";
import { ChatContext } from "../../../context/ChatProvider";

export default function ChatPeople() {
    const { conversationsState, setConversationsState, isChattingState } =
        useContext(ChatContext);

    const { userDetailsState } = useContext(AuthContext);

    const [pageNumberState, setPageNumberState] = useState(1);
    const limit = 10;
    const hasMoreRef = useRef(true);

    const [loadingState, setLoadingState] = useState(false);
    const [errorState, setErrorState] = useState("");

    const scrollRef = useRef();

    useEffect(() => {
        setConversationsState([]);
        hasMoreRef.current = true;
        setPageNumberState(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userDetailsState.id]);

    useEffect(() => {
        const setConversations = async () => {
            setLoadingState(true);

            if (pageNumberState === 1) {
                setConversationsState([]);
                try {
                    const token = getAuthToken();
                    var res = await getUserConversationsApi(
                        token,
                        pageNumberState,
                        limit
                    );
                    if (!res.data.error) {
                        setErrorState("");
                        setConversationsState([...res.data.conversations]);
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
        if (userDetailsState.id) setConversations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNumberState, userDetailsState.id]);

    useEffect(() => {
        const setMoreConversations = async () => {
            setLoadingState(true);

            if (pageNumberState > 1) {
                try {
                    const token = getAuthToken();
                    var res = await getUserConversationsApi(
                        token,
                        pageNumberState,
                        limit
                    );
                    if (!res.data.error) {
                        setErrorState("");
                        setConversationsState((prev) => [
                            ...prev,
                            ...res.data.conversations,
                        ]);

                        if (res.data.posts.length < limit)
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
        if (userDetailsState.id) setMoreConversations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNumberState, userDetailsState.id]);

    useInfiniteScroll(
        scrollRef,
        () => setPageNumberState((prev) => prev + 1),
        loadingState,
        hasMoreRef.current
    );

    useStretchDiv(scrollRef);

    return (
        <MainPage
            className={"sm:py-4"}
            style={isChattingState ? { display: "none" } : {}}
        >
            <div
                className="w-full h-full
                        lg:max-w-[800px]
                        sm:max-w-[500px]
                        sm:py-2
                        flex flex-col items-center space-y-2 
                        border-"
            >
                <div className="sm:text-3xl text-xl py-2">Messages</div>
                <div
                    ref={scrollRef}
                    className="overflow-y-scroll w-full h-full
                            border-"
                >
                    {conversationsState.map((conversation) => {
                        return (
                            <ChatUserItem
                                key={conversation.id}
                                conversation={conversation}
                            />
                        );
                    })}
                    {errorState && <p className="text-red-600">{errorState}</p>}
                    {loadingState && (
                        <AiOutlineLoading3Quarters className="animate-spin text-3xl" />
                    )}
                </div>
            </div>
        </MainPage>
    );
}
