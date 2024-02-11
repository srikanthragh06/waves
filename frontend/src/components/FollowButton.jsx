import React, { useContext, useEffect, useState } from "react";
import PurpleButton from "./PurpleButton";
import {
    followUserApi,
    isFollowingApi,
    unfollowUserApi,
} from "../api/following";
import { AuthContext } from "../context/AuthProvider";
import { getAuthToken } from "../utils/token";

export default function FollowButton({ profileId }) {
    const { userDetailsState } = useContext(AuthContext);

    const [followLoadingState, setFollowLoadingState] = useState(false);
    const [isFollowingProfileState, setIsFollowingProfileState] =
        useState(false);

    const handleFollowClick = async (e) => {
        setFollowLoadingState(true);

        const token = getAuthToken();
        if (!isFollowingProfileState) {
            var res = await followUserApi(token, profileId);
            if (!res.data.error) {
                setIsFollowingProfileState(true);
            }
        } else {
            res = await unfollowUserApi(token, profileId);
            if (!res.data.error) {
                setIsFollowingProfileState(false);
            }
        }

        setFollowLoadingState(false);
    };

    const setFollowingStatus = async (followerId) => {
        const res = await isFollowingApi(followerId, profileId);
        if (!res.data.error) {
            setIsFollowingProfileState(res.data.isFollowing);
        }
    };

    useEffect(() => {
        if (userDetailsState.id) {
            setFollowingStatus(userDetailsState.id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userDetailsState.id]);

    return (
        <PurpleButton
            style={
                isFollowingProfileState
                    ? {
                          lineHeight: "1",
                          backgroundColor: "white",
                          color: "black",
                          fontWeight: "bold",
                      }
                    : { lineHeight: "1" }
            }
            className={`text-sm sm:text-lg sm:px-12 px-4 py-0 bg-color3
                flex justify-center items-center rounded-lg
                hover:opacity-75`}
            onClick={(e) => handleFollowClick(e)}
            loadingState={followLoadingState}
        >
            {isFollowingProfileState ? "Unfollow" : "Follow"}
        </PurpleButton>
    );
}
