import React, { useContext, useEffect, useRef, useState } from "react";
import MainPage from "../../components/MainPage";
import { AuthContext } from "../../context/AuthProvider";
import { ChatContext } from "../../context/ChatProvider";
import { getAuthToken } from "../../utils/token";
import { getUserConversationsApi } from "../../api/conversation";
import useInfiniteScroll from "../../hooks/useInfiteScroll";
import useStretchDiv from "../../hooks/useStretchDiv";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import SharePostUserItem from "./SharePostUserItem";
import { useParams } from "react-router-dom";

export default function SharePost() {
    const { postId } = useParams();

    const { conversationsState, setConversationsState } =
        useContext(ChatContext);

    const { userDetailsState } = useContext(AuthContext);

    const [sharePostStatusState, setSharePostStatusState] = useState({
        isPending: false,
        error: "",
    });

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
        <MainPage>
            <div
                className="w-full h-full
                        lg:max-w-[800px]
                        sm:max-w-[500px]
                        sm:py-2
                        flex flex-col items-center space-y-2 
                        border-2"
            >
                <div className="sm:text-3xl text-xl py-2">Send Post to...</div>

                {sharePostStatusState.isPending ? (
                    <AiOutlineLoading3Quarters className="animate-spin text-3xl" />
                ) : (
                    <p className="text-red-600 text-base">
                        {sharePostStatusState.error}
                    </p>
                )}

                <div
                    ref={scrollRef}
                    className="overflow-y-scroll w-full h-full
                            border-"
                >
                    {conversationsState.map((conversation) => {
                        return (
                            <SharePostUserItem
                                key={conversation.id}
                                postId={postId}
                                conversation={conversation}
                                setSharePostStatusState={
                                    setSharePostStatusState
                                }
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
