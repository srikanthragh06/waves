import React, { useContext, useEffect, useRef, useState } from "react";
import { getFeedPostsApi } from "../../api/post";
import { AuthContext } from "../../context/AuthProvider";
import { MainPageContext } from "../../components/MainPage";
import useInfiniteScroll from "../../hooks/useInfiteScroll";
import PostItem from "../../components/post/PostItem";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function FeedPostsDisplay() {
    const { userDetailsState } = useContext(AuthContext);

    const [pageNumberState, setPageNumberState] = useState(1);
    const limit = 5;
    const hasMoreRef = useRef(true);

    const [loadingState, setLoadingState] = useState(false);
    const [errorState, setErrorState] = useState("");

    const { mainPageRef } = useContext(MainPageContext);

    const [postsState, setPostsState] = useState([]);

    useEffect(() => {
        setPostsState([]);
        hasMoreRef.current = true;
        setPageNumberState(1);
    }, [userDetailsState.id]);

    useEffect(() => {
        const setPosts = async () => {
            setLoadingState(true);

            if (pageNumberState === 1) {
                setPostsState([]);
                try {
                    var res = await getFeedPostsApi(
                        userDetailsState.id,
                        pageNumberState,
                        limit
                    );
                    if (!res.data.error) {
                        setErrorState("");
                        setPostsState([...res.data.posts]);
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
        if (userDetailsState.id) setPosts();
    }, [pageNumberState, userDetailsState.id]);

    useEffect(() => {
        const setMorePosts = async () => {
            setLoadingState(true);

            if (pageNumberState > 1) {
                try {
                    var res = await getFeedPostsApi(
                        userDetailsState.id,
                        pageNumberState,
                        limit
                    );
                    if (!res.data.error) {
                        setErrorState("");
                        setPostsState((prev) => [...prev, ...res.data.posts]);

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
        if (userDetailsState.id) setMorePosts();
    }, [pageNumberState, userDetailsState.id]);

    useInfiniteScroll(
        mainPageRef,
        () => setPageNumberState((prev) => prev + 1),
        loadingState,
        hasMoreRef.current
    );

    return (
        <div
            className="w-full
            lg:max-w-[800px]
            sm:max-w-[500px]
            sm:py-2
            flex flex-col space-y-10
            border-"
        >
            {postsState.map((post) => {
                return (
                    <PostItem key={post.id} postId={post.id} inMessage={true} />
                );
            })}
            {errorState && <p className="text-red-600">{errorState}</p>}
            {loadingState && (
                <AiOutlineLoading3Quarters className="animate-spin text-3xl" />
            )}
        </div>
    );
}
