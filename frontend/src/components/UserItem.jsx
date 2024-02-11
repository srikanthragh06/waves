import React, { useEffect, useState } from "react";
import ProfilePic from "./ProfilePic";
import { getProfilePictureApi } from "../api/user";
import { useNavigate } from "react-router-dom";

export default function UserItem({ userDetails }) {
    const navigate = useNavigate();

    const [profilePicState, setProfilePicState] = useState({
        pic: null,
        isPending: false,
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
        if (userDetails.id) setProfilePicture(userDetails.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userDetails.id]);

    return (
        <div
            className="bg-color4 flex flex-row justify-between px-4 py-2
                        items-center border-color5 border-[0.5px]
                        cursor-pointer transition "
            onClick={() => {
                navigate(`/profile/${userDetails.id}`);
            }}
        >
            <ProfilePic
                src={profilePicState.pic}
                loadingState={profilePicState.isPending}
                className={"w-[80px] h-[80px]"}
            />
            <div
                className="flex flex-col justify-around items-center border-green-600 border-
                            w-full h-full
                            sm:text-2xl text-lg"
            >
                <p className="border-red-900 border- ">
                    {userDetails.username}
                </p>
                <div
                    className="flex flex-row justify-center space-x-6 items-center sm:text-lg text-base w-full
                                text-color1"
                >
                    <p>{userDetails.followers} followers</p>
                    <p>{userDetails.posts} posts</p>
                </div>
            </div>
        </div>
    );
}
