import React, { useEffect, useState } from "react";
import { getPostDetailsApi, getPostMediaApi } from "../../../api/post";
import { getProfilePictureApi } from "../../../api/user";
import { getFileType } from "../../../utils/utils";
import PostMessageHeader from "./PostMessageHeader";
import PostMessageFooter from "./PostMessageFooter";
import PostMessageBody from "./PostMessageBody";

export default function PostMessageItem({ postId, isUserMsg, message }) {
    const [postDetailsState, setPostDetailsState] = useState({ id: postId });

    const [posterProfilePicState, setPosterProfilePicState] = useState({
        pic: null,
        isPending: null,
        error: "",
    });

    const [postMediaState, setPostMediaState] = useState({
        media: null,
        isPending: null,
        error: "",
    });

    const setPostDetails = async (postId) => {
        const res = await getPostDetailsApi(postId);
        if (!res.data.error) {
            const { post } = res.data;
            setPostDetailsState((prev) => {
                return {
                    ...prev,
                    id: post.id,
                    content: post.content,
                    likes: post.likes,
                    dislikes: post.dislikes,
                    comments: post.comments,
                    postedTime: post.createdAt,
                    mediaType: getFileType(post.mediaFileName),
                    posterId: post.User?.id,
                    posterUsername: post.User?.username,
                };
            });
        }
    };

    const setProfilePicture = async (profileId) => {
        setPosterProfilePicState((prev) => {
            return {
                ...prev,
                isPending: true,
            };
        });
        const res = await getProfilePictureApi(profileId);
        if (!res.error) {
            const picURL = URL.createObjectURL(res);
            setPosterProfilePicState((prev) => {
                return {
                    ...prev,
                    pic: picURL,
                    isPending: false,
                    error: "",
                };
            });
        }

        setPosterProfilePicState((prev) => {
            return {
                ...prev,
                isPending: false,
                error: res.error,
            };
        });
    };

    const setPostMedia = async () => {
        setPostMediaState((prev) => {
            return { ...prev, isPending: true };
        });

        const res = await getPostMediaApi(postDetailsState.id);
        if (!res.error) {
            const mediaURL = URL.createObjectURL(res);
            return setPostMediaState((prev) => {
                return {
                    ...prev,
                    media: mediaURL,
                    isPending: false,
                    error: "",
                };
            });
        }

        setPostMediaState((prev) => {
            return {
                ...prev,
                media: null,
                isPending: false,
                error: res.error,
            };
        });
    };

    useEffect(() => {
        if (postId) setPostDetails(postId);
    }, [postId]);

    useEffect(() => {
        if (postDetailsState.posterId)
            setProfilePicture(postDetailsState.posterId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postDetailsState.posterId]);

    useEffect(() => {
        if (postDetailsState.id) {
            setPostMedia();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postDetailsState.id]);

    return (
        <div
            style={
                isUserMsg ? { marginLeft: "auto", borderColor: "color2" } : {}
            }
            className="w-5/6 sm:w-1/2 h- rounded-full cursor-
                        flex flex-col"
        >
            <PostMessageHeader
                message={message}
                isUserMsg={isUserMsg}
                postId={postDetailsState.id}
                posterId={postDetailsState.posterId}
                posterUsername={postDetailsState.posterUsername}
                profilePicState={posterProfilePicState}
            />
            {postDetailsState.content && (
                <>
                    <PostMessageBody
                        postId={postId}
                        postMediaState={postMediaState}
                        mediaType={postDetailsState.mediaType}
                    />
                    <PostMessageFooter
                        postId={postDetailsState.id}
                        content={postDetailsState.content}
                        postedTime={postDetailsState.postedTime}
                        postLikes={postDetailsState.likes}
                        postDislikes={postDetailsState.dislikes}
                        postComments={postDetailsState.comments}
                    />
                </>
            )}
        </div>
    );
}
