import React, { useState } from "react";
import FormInput from "../../pages/authPage/FormInput";
import { addCommentApi } from "../../api/comment";
import { getAuthToken } from "../../utils/token";
import EmojiPicker from "../EmojiPicker";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function AddCommentForm({
    setCommentsState,
    postId,
    replyingCommentState,
    setReplyingCommentState,
}) {
    const [commentTextState, setCommentTextState] = useState("");
    const [emojiPickerVisibleState, setEmojiPickerVisibleState] =
        useState(false);

    const [loadingState, setLoadingState] = useState(false);
    const [errorState, setErrorState] = useState("");

    const handlePostComment = async (e) => {
        e.preventDefault();
        setLoadingState(true);

        if (commentTextState === "") return;

        const token = getAuthToken();
        if (!replyingCommentState) {
            var res = await addCommentApi(token, postId, commentTextState);
        } else {
            res = await addCommentApi(
                token,
                postId,
                commentTextState,
                replyingCommentState.id
            );
        }
        if (!res.data.error) {
            setCommentsState((prev) => {
                return [res.data.comment, ...prev];
            });
            setErrorState("");
        } else {
            setErrorState(res.data.error);
        }
        setCommentTextState("");
        setReplyingCommentState({});
        setLoadingState(false);
    };

    return (
        <div className="flex flex-col space-y-2 px-2 mt-1 py-4 border-t-2 border-color4">
            {replyingCommentState?.id && (
                <div className="text-sm  px-2 opacity-35 text-white border-2 rounded-lg py-1">
                    <p>--Replying to @{replyingCommentState?.user?.username}</p>
                    <div
                        className="truncate"
                        style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {replyingCommentState?.content}
                    </div>
                    <p
                        className="text-right text-sm cursor-pointer"
                        onClick={() => setReplyingCommentState({})}
                    >
                        Cancel
                    </p>
                </div>
            )}
            <form
                onSubmit={(e) => handlePostComment(e)}
                className="flex space-x-2 items-center text-sm"
            >
                <FormInput
                    className={`md:w-full w-full`}
                    placeholder="Add comment..."
                    inputState={commentTextState}
                    setInputState={setCommentTextState}
                />
                <div className="">
                    <EmojiPicker
                        visible={emojiPickerVisibleState}
                        setVisible={setEmojiPickerVisibleState}
                        handleEmojiSelect={(emoji) =>
                            setCommentTextState((prev) => prev + emoji.native)
                        }
                    />
                </div>
                {loadingState ? (
                    <AiOutlineLoading3Quarters className="animate-spin text-lg " />
                ) : (
                    <button
                        style={
                            commentTextState === ""
                                ? { cursor: "auto", opacity: "0.4" }
                                : {}
                        }
                    >
                        Post
                    </button>
                )}
            </form>
            <p className="text-red-600 text-base">{errorState}</p>
        </div>
    );
}
