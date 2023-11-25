import React, { useContext, useEffect, useState } from "react";
import UserUpdateTitle from "./UserUpdateTitle";
import UserUpdateUsername from "./UserUpdateUsername";
import UserUpdateBio from "./UserUpdateBio";
import UserUpdateGender from "./UserUpdateGender";
import UserUpdateDateOfBirth from "./UserUpdateDateOfBirth";
import UserUpdateSubmitButton from "./UserUpdateSubmitButton";
import { AuthContext } from "../../../context/AuthProvider";
import FormError from "../../authPage/form/FormError";

export default function UserUpdateForm() {
    const { authInfoState, handleUserUpdate } = useContext(AuthContext);

    const [userInfoState, setUserInfoState] = useState({
        username: authInfoState.profile.username,
        bio: authInfoState.profile.bio,
        gender: authInfoState.profile.gender,
        dateOfBirth: authInfoState.profile.dateOfBirth,
    });
    const [submitModeState, setSubmitModeState] = useState(false);

    const handleUserUpdateSubmit = async (e) => {
        e.preventDefault();
        if (!submitModeState) return;

        await handleUserUpdate({
            username: userInfoState.username,
            bio: userInfoState.bio,
            gender: userInfoState.gender,
            dateOfBirth: userInfoState.dateOfBirth.slice(0, 10),
        });
    };

    useEffect(() => {
        if (
            userInfoState.username !== authInfoState.profile.username ||
            userInfoState.bio !== authInfoState.profile.bio ||
            userInfoState.dateOfBirth !== authInfoState.profile.dateOfBirth ||
            userInfoState.gender !== authInfoState.profile.gender
        )
            setSubmitModeState(true);
        else setSubmitModeState(false);
    }, [userInfoState]);

    return (
        <form
            onSubmit={(e) => handleUserUpdateSubmit(e)}
            className="bg-color4 px-3 flex flex-col h-auto w-full relative justify-around py-4 space-y-4 "
        >
            <UserUpdateTitle />
            <UserUpdateUsername
                userInfoState={userInfoState}
                setUserInfoState={setUserInfoState}
            />
            <UserUpdateBio
                userInfoState={userInfoState}
                setUserInfoState={setUserInfoState}
            />
            <UserUpdateGender
                userInfoState={userInfoState}
                setUserInfoState={setUserInfoState}
            />
            <UserUpdateDateOfBirth
                userInfoState={userInfoState}
                setUserInfoState={setUserInfoState}
            />
            <div className="flex justify-center">
                <FormError>{authInfoState.userUpdateError}</FormError>
            </div>
            <UserUpdateSubmitButton
                onClick={handleUserUpdateSubmit}
                submitModeState={submitModeState}
            />
        </form>
    );
}
