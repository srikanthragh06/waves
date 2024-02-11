import React, { useContext, useEffect, useState } from "react";
import ProfilePic from "../ProfilePic";
import { formatTimestamp, usernamifyContent } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import { getProfilePictureApi } from "../../api/user";
import { AuthContext } from "../../context/AuthProvider";
import DeleteCommentConfirmation from "./DeleteCommentConfirmation";

export default function CommentItem({
    comment,
    setReplyingCommentState,
    setCommentsState,
}) {
    const navigate = useNavigate();
    const { userDetailsState } = useContext(AuthContext);

    const [isDeletingCommentState, setIsDeletingCommentState] = useState(false);

    const [profilePicState, setProfilePicState] = useState({
        pic: null,
        isPending: null,
        error: "",
    });

    const setProfilePicture = async (profileId) => {
        setProfilePicState((prev) => {
            return {
                ...prev,
                isPending: true,
            };
        });
        const res = await getProfilePictureApi(profileId);
        if (!res.error) {
            const picURL = URL.createObjectURL(res);
            setProfilePicState((prev) => {
                return {
                    ...prev,
                    pic: picURL,
                    isPending: false,
                    error: "",
                };
            });
        }

        setProfilePicState((prev) => {
            return {
                ...prev,
                isPending: false,
                error: res.error,
            };
        });
    };

    useEffect(() => {
        if (comment.user.id) setProfilePicture(comment.user.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [comment.user.id]);

    return (
        <div className="pt-4 px-2 w-full flex space-x-4 border-b-2 border-color4">
            <div className="flex flex-col border- items-center justify-between">
                <ProfilePic
                    className={"w-[40px] h-[40px] border-"}
                    src={profilePicState.pic}
                    loadingState={profilePicState.isPending}
                />

                {userDetailsState.id === comment.user.id && (
                    <p
                        className="text-[12px] text-right w-full m-1 text-color1 cursor-pointer hover:text-color2
                            border-"
                        onClick={() => setIsDeletingCommentState(true)}
                    >
                        Delete
                    </p>
                )}
                {isDeletingCommentState && (
                    <DeleteCommentConfirmation
                        setVisible={setIsDeletingCommentState}
                        commentId={comment.id}
                        setCommentsState={setCommentsState}
                    />
                )}
            </div>
            <div
                className="border- px-2 w-full sm:text-base text-sm word-wrap"
                style={{ textOverflow: "elipsis", overflow: "hidden" }}
            >
                {comment.replyComment && (
                    <div className="text-sm  px-2 opacity-35 text-white border-2 rounded-lg py-1 mb-2">
                        <p>
                            --Replying to @
                            {comment?.replyComment?.user?.username}
                        </p>
                        <div
                            className="truncate"
                            style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: "vertical",
                                whiteSpace: "pre-line",
                            }}
                        >
                            {comment.replyComment?.content}
                        </div>
                    </div>
                )}
                <span
                    className="font-bold "
                    onClick={() => navigate(`/profile/${comment.user.id}`)}
                >
                    {comment.user?.username}
                </span>{" "}
                <span>{usernamifyContent(comment.content)}</span>
                <p className="text-[12px] text-right w-full m-1 border-">
                    {formatTimestamp(comment.createdAt)}
                </p>
                <p
                    className="text-[12px] text-right w-full m-1 text-color1 cursor-pointer hover:text-color2
                            border-"
                    onClick={() => setReplyingCommentState({ ...comment })}
                >
                    Reply
                </p>
            </div>
        </div>
    );
}
