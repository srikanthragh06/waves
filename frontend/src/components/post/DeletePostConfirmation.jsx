import React, { useState } from "react";
import PageOverlay from "../PageOverlay";
import PurpleButton from "../PurpleButton";
import { deletePostApi } from "../../api/post";
import { getAuthToken } from "../../utils/token";

export default function DeletePostConfirmation({ setVisible, postId }) {
    const [deletePostStatus, setDeletePostStatus] = useState({
        isPending: false,
        error: "",
    });

    const handlePostDelete = async (e) => {
        setDeletePostStatus((prev) => {
            return { ...prev, isPending: true };
        });

        const token = getAuthToken();
        const res = await deletePostApi(token, postId);
        if (!res.data.error) {
            setVisible(false);
            window.location.reload();
            setDeletePostStatus((prev) => {
                return { error: "", isPending: false };
            });
        } else {
            setDeletePostStatus((prev) => {
                return { error: res.data.error, isPending: false };
            });
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
                    Are you sure you want to delete this post and all its
                    comments?
                </p>
                <p className="text-red-600">{deletePostStatus.error}</p>
                <div className="flex justify-around w-full">
                    <PurpleButton
                        className={"px-6 text-base sm:text-lg"}
                        onClick={(e) => handlePostDelete(e)}
                        loadingState={deletePostStatus.isPending}
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
