import React, { useState } from "react";
import PageOverlay from "../PageOverlay";
import PurpleButton from "../PurpleButton";
import { getAuthToken } from "../../utils/token";
import { deleteCommentApi } from "../../api/comment";

export default function DeleteCommentConfirmation({
    setVisible,
    commentId,
    setCommentsState,
}) {
    const [deleteCommentStatus, setDeleteCommentStatus] = useState({
        isPending: false,
        error: "",
    });

    const handleCommentDelete = async (e) => {
        setDeleteCommentStatus((prev) => {
            return { ...prev, isPending: true };
        });

        const token = getAuthToken();
        const res = await deleteCommentApi(token, commentId);
        if (!res.data.error) {
            setCommentsState((prev) => {
                return prev.filter(
                    (comment) =>
                        comment.id !== commentId &&
                        comment.replyCommentId !== commentId
                );
            });
            setVisible(false);
            setDeleteCommentStatus({ error: "", isPending: false });
        } else {
            setDeleteCommentStatus({ error: res.data.error, isPending: false });
        }
    };

    return (
        <PageOverlay className="border-">
            <div
                className=" sm:w-[50%] w-full max-w-[600px] border- bg-color4 rounded-lg
                            px-10 py-4 flex flex-col items-center space-y-10 
                            text-base sm:text-lg"
            >
                <p>
                    Are you sure you want to delete this comments and all its
                    replies?
                </p>
                <p className="text-red-600">{deleteCommentStatus.error}</p>
                <div className="flex justify-around w-full">
                    <PurpleButton
                        className={"px-6 text-base sm:text-lg"}
                        onClick={(e) => handleCommentDelete(e)}
                        loadingState={deleteCommentStatus.isPending}
                    >
                        Yes
                    </PurpleButton>
                    <PurpleButton
                        className={"px-6  text-base sm:text-lg"}
                        onClick={() => setVisible(false)}
                    >
                        No
                    </PurpleButton>
                </div>
            </div>
        </PageOverlay>
    );
}
