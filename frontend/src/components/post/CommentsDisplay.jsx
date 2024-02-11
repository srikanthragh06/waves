import React, { useEffect, useRef, useState } from "react";
import { getPostCommentsApi } from "../../api/comment";
import CommentItem from "./CommentItem";
import AddCommentForm from "./AddCommentForm";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import useInfiniteScroll from "../../hooks/useInfiteScroll";

export default function CommentsDisplay({ postId }) {
    const [pageNumberState, setPageNumberState] = useState(1);
    const limit = 5;
    const hasMoreRef = useRef(true);

    const [loadingState, setLoadingState] = useState(false);
    const [errorState, setErrorState] = useState("");

    const scrollRef = useRef();

    const [commentsState, setCommentsState] = useState([]);
    const [replyingCommentState, setReplyingCommentState] = useState({});

    useEffect(() => {
        const setComments = async () => {
            setLoadingState(true);

            if (pageNumberState === 1) {
                try {
                    var res = await getPostCommentsApi(
                        postId,
                        pageNumberState,
                        limit
                    );
                    if (!res.data.error) {
                        setErrorState("");
                        setCommentsState([...res.data.comments]);
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
        setComments();
    }, [pageNumberState, postId]);

    useEffect(() => {
        const setMoreComments = async () => {
            setLoadingState(true);

            if (pageNumberState > 1) {
                try {
                    var res = await getPostCommentsApi(
                        postId,
                        pageNumberState,
                        limit
                    );
                    if (!res.data.error) {
                        setErrorState("");
                        setCommentsState((prev) => [
                            ...prev,
                            ...res.data.comments,
                        ]);

                        if (res.data.comments.length < limit)
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

        setMoreComments();
    }, [pageNumberState, postId]);

    useInfiniteScroll(
        scrollRef,
        () => setPageNumberState((prev) => prev + 1),
        loadingState,
        hasMoreRef.current
    );

    return (
        <div className="w-full border-t-2 border-color4 text-base ">
            <div
                className="w-full  max-h-[400px] overflow-y-scroll"
                ref={scrollRef}
            >
                {commentsState.map((comment) => {
                    return (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            setReplyingCommentState={setReplyingCommentState}
                            setCommentsState={setCommentsState}
                        />
                    );
                })}
                {errorState && <p className="text-red-600">{errorState}</p>}
                {loadingState && (
                    <AiOutlineLoading3Quarters className="animate-spin text-3xl" />
                )}
            </div>
            <AddCommentForm
                setCommentsState={setCommentsState}
                replyingCommentState={replyingCommentState}
                setReplyingCommentState={setReplyingCommentState}
                postId={postId}
            />
        </div>
    );
}
