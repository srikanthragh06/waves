import React, { useState } from "react";
import { createContext } from "react";
import { getAuthToken } from "../utils/token";
import { getProfilePicture } from "../api/user";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { useEffect } from "react";

export const ProfilePictureContext = createContext();

export default function ProfilePictureProvider({ children }) {
    const [profilePicState, setProfilePicState] = useState(null);
    const [profilePicUpdateDetails, setProfilePicUpdateDetails] = useState({
        isLoading: false,
        error: true,
    });
    const { authInfoState } = useContext(AuthContext);

    const setProfilePic = async () => {
        const token = getAuthToken();
        if (!token) return;

        const res = await getProfilePicture(token);
        if (res.error) {
            return setProfilePicState(null);
        }
        const profilePicURL = URL.createObjectURL(res);
        return setProfilePicState(profilePicURL);
    };
    const removeProfilePic = async () => {
        return setProfilePicState(null);
    };

    useEffect(() => {
        if (authInfoState.isLoggedIn) {
            setProfilePic();
        } else {
            removeProfilePic();
        }
    }, [authInfoState.isLoggedIn]);

    return (
        <ProfilePictureContext.Provider
            value={{
                profilePicState,
                setProfilePicState,
                setProfilePic,
                removeProfilePic,
                profilePicUpdateDetails,
                setProfilePicUpdateDetails,
            }}
        >
            {children}
        </ProfilePictureContext.Provider>
    );
}
