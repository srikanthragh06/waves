import React, { useContext, useEffect, useState } from "react";
import { formatTimestamp, usernamifyContent } from "../../utils/utils";
import { getAuthToken } from "../../utils/token";
import { AuthContext } from "../../context/AuthProvider";
import { dislikePostApi, likePostApi, userLikesPostApi } from "../../api/post";
import {
    AiFillDislike,
    AiFillLike,
    AiOutlineDislike,
    AiOutlineLike,
} from "react-icons/ai";
import { FaRegComments } from "react-icons/fa";
import CommentsDisplay from "./CommentsDisplay";

export default function PostFooter({
    postId,
    content,
    postedTime,
    postLikes,
    postDislikes,
    postComments,
}) {
    const [showCommentsState, setShowCommentsState] = useState(false);

    const { userDetailsState } = useContext(AuthContext);

    const [likedPostState, setLikedPostState] = useState(false);
    const [dislikedPostState, setDislikedPostState] = useState(false);

    const [postStatsState, setPostStatsState] = useState({
        likes: postLikes,
        dislikes: postDislikes,
        comments: postComments,
    });

    const handleLikePost = async (e) => {
        const token = getAuthToken();
        const res = await likePostApi(token, postId);

        if (!res.data.error) {
            setLikedPostState(res.data.isLiked);

            if (res.data.isLiked)
                setPostStatsState((prev) => {
                    return { ...prev, likes: prev.likes + 1 };
                });
            else
                setPostStatsState((prev) => {
                    return { ...prev, likes: prev.likes - 1 };
                });
        }
    };

    const handleDislikePost = async (e) => {
        const token = getAuthToken();
        const res = await dislikePostApi(token, postId);

        if (!res.data.error) {
            setDislikedPostState(res.data.isDisliked);

            if (res.data.isDisliked)
                setPostStatsState((prev) => {
                    return { ...prev, dislikes: prev.dislikes + 1 };
                });
            else
                setPostStatsState((prev) => {
                    return { ...prev, dislikes: prev.dislikes - 1 };
                });
        }
    };

    const updateLikeStatus = async () => {
        const res = await userLikesPostApi(userDetailsState.id, postId);
        if (res?.data?.error) return;
        setLikedPostState(res.data.likeExists);
        setDislikedPostState(res.data.dislikeExists);
    };

    useEffect(() => {
        if (userDetailsState.id) updateLikeStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userDetailsState.id]);

    return (
        <footer className="w-full border-color4 border-2 border-t-none p-1">
            <div className=" border-b-2  border-color4 px-3 py-2 w-full  ">
                <span style={{ whiteSpace: "pre-line", textAlign: "center" }}>
                    {usernamifyContent(content)}
                </span>
                <p className="text-[12px] text-right w-full m-1 border-">
                    {formatTimestamp(postedTime)}
                </p>
            </div>

            <div
                className="border-b- text-white px-3 py-2
                        flex space-x-4"
            >
                <div
                    className="border- text-center flex space-x-1
                    opacity-70 cursor-pointer
                    hover:opacity-100 hover:font-"
                    onClick={(e) => handleLikePost(e)}
                >
                    {likedPostState ? (
                        <AiFillLike className="text-2xl" />
                    ) : (
                        <AiOutlineLike className="text-2xl " />
                    )}
                    <span className="text-[13px] sm:text-base">
                        {postStatsState.likes} likes
                    </span>
                </div>
                <div
                    className="border- text-center flex space-x-1
                    opacity-70 cursor-pointer
                    hover:opacity-100 hover:font-"
                    onClick={(e) => handleDislikePost(e)}
                >
                    {dislikedPostState ? (
                        <AiFillDislike className="text-2xl" />
                    ) : (
                        <AiOutlineDislike className="text-2xl" />
                    )}
                    <span className="text-[13px] sm:text-base">
                        {postStatsState.dislikes} dislikes
                    </span>
                </div>
                <div
                    className="border- text-center flex space-x-1
                    opacity-70 cursor-pointer
                    hover:opacity-100 hover:font-"
                    onClick={(e) => setShowCommentsState((prev) => !prev)}
                >
                    <FaRegComments className="text-2xl " />
                    <span className="text-[13px] sm:text-base">
                        {postStatsState.comments} comments
                    </span>
                </div>
            </div>

            {showCommentsState && <CommentsDisplay postId={postId} />}
        </footer>
    );
}
