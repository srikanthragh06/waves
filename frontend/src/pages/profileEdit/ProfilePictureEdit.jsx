import React, { useContext, useEffect, useState } from "react";
import ProfilePic from "../../components/ProfilePic";
import { AuthContext } from "../../context/AuthProvider";
import {
    getProfilePictureApi,
    removeProfilePictureApi,
    uploadProfilePictureApi,
} from "../../api/user";
import PurpleButton from "../../components/PurpleButton";
import PurpleFileUploader from "../../components/PurpleFileUploader";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { getAuthToken } from "../../utils/token";

export default function ProfilePictureEdit() {
    const { userDetailsState } = useContext(AuthContext);

    const [profilePicState, setProfilePicState] = useState({
        pic: null,
        isPending: false,
        error: "",
    });

    const [profilePicUpdateStatusState, setProfilePicUpdateStatusState] =
        useState({
            error: "",
            isPending: false,
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
            return setProfilePicState({
                pic: picURL,
                isPending: false,
                error: "",
            });
        }

        setProfilePicState((prev) => {
            return {
                pic: null,
                isPending: false,
                error: res.error,
            };
        });
    };

    const handleFileTypeError = () => {
        setProfilePicUpdateStatusState((prev) => {
            return { ...prev, error: "Incorrect file type" };
        });
    };

    const handleUploaderChange = async (file) => {
        const formData = new FormData();
        formData.append("profilePicture", file);

        setProfilePicUpdateStatusState((prev) => {
            return { ...prev, isPending: true };
        });
        const token = getAuthToken();
        const res = await uploadProfilePictureApi(token, formData);

        if (!res || res.data.error) {
            return setProfilePicUpdateStatusState({
                isPending: false,
                error: "Could not update profile picture",
            });
        }

        await setProfilePicture(userDetailsState.id);

        return setProfilePicUpdateStatusState({
            isPending: false,
            error: "",
        });
    };

    const handleRemoveProfilePicture = async () => {
        setProfilePicUpdateStatusState((prev) => {
            return { ...prev, isPending: true };
        });

        const token = getAuthToken();
        const res = await removeProfilePictureApi(token);
        if (!res || res.data.error) {
            return setProfilePicUpdateStatusState({
                isPending: false,
                error: "Failed to remove profile picture",
            });
        }
        await setProfilePicture(userDetailsState.id);

        return setProfilePicUpdateStatusState({
            isPending: false,
            error: "",
        });
    };

    useEffect(() => {
        if (userDetailsState.id) setProfilePicture(userDetailsState.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userDetailsState.id]);

    return (
        <div
            className=" w-full
                        lg:max-w-[800px] 
                        sm:max-w-[500px]
                        bg-color4 rounded-l
                        flex justify-around items-center 
                        py-4

                        border-"
        >
            <ProfilePic
                src={profilePicState.pic}
                className={`sm:w-[150px] sm:h-[150px]
                            w-[100px] h-[100px]`}
            />
            <div
                className="flex flex-col justify-around items-center h-full
                            border-"
            >
                {profilePicUpdateStatusState.isPending ? (
                    <AiOutlineLoading3Quarters className="animate-spin text-3xl" />
                ) : (
                    <>
                        <PurpleFileUploader
                            text="Upload picture"
                            className="sm:text-base text-sm"
                            types={["png", "jpg", "jpeg"]}
                            onTypeError={handleFileTypeError}
                            handleChange={handleUploaderChange}
                            // busy={profilePicUpdateDetails.isLoading}
                        />
                        {profilePicState.pic && (
                            <PurpleButton
                                className="sm:text-base text-sm"
                                onClick={handleRemoveProfilePicture}
                            >
                                Remove Picture
                            </PurpleButton>
                        )}
                        <p className="text-red">
                            {profilePicUpdateStatusState.error}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
