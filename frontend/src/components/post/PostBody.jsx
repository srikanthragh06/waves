import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function PostBody({ postMediaState, mediaType }) {
    return (
        <div className="flex justify-center w-full max-h-[900px] border-color4 border-x-2">
            {postMediaState.isPending ? (
                <AiOutlineLoading3Quarters className="animate-spin text-3xl" />
            ) : null}

            {!postMediaState.isPending &&
            postMediaState.media &&
            mediaType === "image" ? (
                <img
                    className=" max-h-full"
                    src={postMediaState?.media}
                    alt=""
                />
            ) : null}

            {!postMediaState.isPending &&
            postMediaState.media &&
            mediaType === "video" ? (
                <video
                    controls
                    controlsList="nodownload"
                    className=" max-h-full"
                >
                    {/* <video controls width="500" height="300"> */}
                    <source src={postMediaState.media} type="video/mp4" />
                    <source src={postMediaState.media} type="video/avi" />
                    <source src={postMediaState.media} type="video/mkv" />
                    {/* Your browser does not support the video tag. */}
                </video>
            ) : null}

            {}
        </div>
    );
}
