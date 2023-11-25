import React, { useContext } from "react";
import { FiUser } from "react-icons/fi";
import { ProfilePictureContext } from "../context/ProfilePictureProvider";

export default function ProfilePicture({ className }) {
    const { profilePicState } = useContext(ProfilePictureContext);
    return (
        <div className={` ${className}`}>
            {profilePicState ? (
                <img
                    src={profilePicState}
                    className="w-full h-full rounded-[50%] object-cover"
                    alt=""
                />
            ) : (
                <FiUser className="w-full h-full rounded-[50%] object-cover border-2 border-color3 text-color3" />
            )}
        </div>
    );
}
