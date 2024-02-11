import React, { useEffect, useState } from "react";
import { getFileType } from "../../../utils/utils";
import { getMessageMediaApi } from "../../../api/messages";
import { getAuthToken } from "../../../utils/token";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function MessageMedia({ message }) {
    const mediaType = getFileType(message.mediaFileName);

    const [messageMediaState, setMessageMediaState] = useState({
        media: null,
        isPending: null,
        error: "",
    });

    const setMessageMedia = async () => {
        setMessageMediaState((prev) => {
            return { ...prev, isPending: true };
        });

        const token = getAuthToken();
        const res = await getMessageMediaApi(token, message.id);
        if (!res.error) {
            const mediaURL = URL.createObjectURL(res);
            return setMessageMediaState({
                media: mediaURL,
                isPending: false,
                error: "",
            });
        }

        setMessageMediaState({
            media: null,
            isPending: false,
            error: res.error,
        });
    };

    useEffect(() => {
        if (message.id) {
            setMessageMedia();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [message.id]);

    return (
        <div className="mb-2">
            {!messageMediaState.isPending && messageMediaState.error && (
                <p className="text-red-600">{messageMediaState.error}</p>
            )}
            {messageMediaState.isPending ? (
                <AiOutlineLoading3Quarters className="animate-spin text-3xl" />
            ) : null}
            {!messageMediaState.isPending &&
            messageMediaState.media &&
            mediaType === "image" ? (
                <img
                    className=" max-h-full"
                    src={messageMediaState?.media}
                    alt=""
                />
            ) : null}

            {!messageMediaState.isPending &&
            messageMediaState.media &&
            mediaType === "video" ? (
                <video
                    controls
                    controlsList="nodownload"
                    className=" max-h-full"
                >
                    {/* <video controls width="500" height="300"> */}
                    <source src={messageMediaState.media} type="video/mp4" />
                    <source src={messageMediaState.media} type="video/avi" />
                    <source src={messageMediaState.media} type="video/mkv" />
                    {/* Your browser does not support the video tag. */}
                </video>
            ) : null}
        </div>
    );
}
