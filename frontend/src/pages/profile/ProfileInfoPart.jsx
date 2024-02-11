import React, { useEffect, useState } from "react";
import ProfilePic from "../../components/ProfilePic";
import ProfileDetailsRight from "./ProfileDetailsRight";
import { useParams } from "react-router-dom";
import { getProfilePictureApi } from "../../api/user";

export default function ProfileInfoPart() {
    const [profilePicState, setProfilePicState] = useState({
        pic: null,
        isPending: false,
        error: "",
    });

    const { userId: profileId } = useParams();

    const setProfilePicture = async (profileId) => {
        setProfilePicState((prev) => {
            return {
                ...prev,
                pic: null,
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
        if (profileId) setProfilePicture(profileId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profileId]);

    return (
        <div
            className="w-full 
                flex-shrink-0 flex justify-between items-center
                sm:w-[100%] sm:max-w-[900px]
                py-4 px-1
                border- "
        >
            <ProfilePic
                className="lg:w-[200px] lg:h-[200px] 
                        sm:w-[150px] sm:h-[150px]
                        w-[100px] h-[100px]
                        "
                src={profilePicState?.pic}
                loadingState={profilePicState?.isPending}
            />
            <ProfileDetailsRight />
        </div>
    );
}
