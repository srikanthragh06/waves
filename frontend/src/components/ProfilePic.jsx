import React from "react";
import { FiUser } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function ProfilePic({
    src,
    className,
    Alt,
    loadingState = false,
}) {
    return loadingState ? (
        <AiOutlineLoading3Quarters className="animate-spin text-3xl" />
    ) : (
        <>
            {src ? (
                <img
                    src={src}
                    className={`object-cover rounded-[50%]  ${className}`}
                    alt="..."
                />
            ) : Alt ? (
                <Alt
                    className={`rounded-[50%]
                     ${className}`}
                />
            ) : (
                <FiUser
                    className={`rounded-[50%]
                         ${className}`}
                />
            )}
        </>
    );
}
