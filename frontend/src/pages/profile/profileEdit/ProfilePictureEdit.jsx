import React, { useContext } from "react";
import PurpleButton from "../../../components/PurpleButton";
import ProfilePicture from "../../../components/ProfilePicture";
import RoundedContainer from "../../../components/RoundedContainer";
import { ProfilePictureContext } from "../../../context/ProfilePictureProvider";
import { removeProfilePicture, uploadProfilePicture } from "../../../api/user";
import { getAuthToken } from "../../../utils/token";
import FormError from "../../authPage/form/FormError";
import PurpleFileUploader from "../../../components/PurpleFileUploader";

export default function ProfilePictureEdit() {
    const {
        profilePicState,
        removeProfilePic,
        setProfilePic,
        profilePicUpdateDetails,
        setProfilePicUpdateDetails,
    } = useContext(ProfilePictureContext);

    const handleRemovePicture = async () => {
        setProfilePicUpdateDetails({
            ...profilePicUpdateDetails,
            isLoading: true,
        });

        const token = getAuthToken();
        const res = await removeProfilePicture(token);
        if (res.error) {
            return setProfilePicUpdateDetails({
                ...profilePicUpdateDetails,
                isLoading: false,
                error: "Failed to remove profile picture",
            });
        }
        removeProfilePic();
        return setProfilePicUpdateDetails({
            ...profilePicUpdateDetails,
            isLoading: false,
            error: "",
        });
    };

    const handleFileTypeError = () => {
        setProfilePicUpdateDetails({
            ...profilePicUpdateDetails,
            error: "Incorrect file type",
        });
    };

    const handleUploaderChange = (file) => {
        const formData = new FormData();
        formData.append("profilePicture", file);
        handleUploadProfilePic(formData);
    };

    const handleUploadProfilePic = async (formData) => {
        setProfilePicUpdateDetails({
            ...profilePicUpdateDetails,
            isLoading: true,
        });

        const token = getAuthToken();
        const res = await uploadProfilePicture(token, formData);
        if (res.error) {
            return setProfilePicUpdateDetails({
                ...profilePicUpdateDetails,
                isLoading: false,
                error: "Could not update profile picture",
            });
        }
        setProfilePic();
        return setProfilePicUpdateDetails({
            ...profilePicUpdateDetails,
            isLoading: false,
            error: "",
        });
    };

    return (
        <RoundedContainer
            className="flex flex-row w-full rounded-md justify-around 
                                        items-center py-2  h-full"
        >
            <ProfilePicture
                className="lg:w-[175px] lg:h-[175px] 
                                sm:w-[125px] sm:h-[125px]
                                w-[100px] h-[100px] "
            />
            <div
                className="flex flex-col justify-evenly
                                        lg:h-[175px] sm:h-[125px] h-[100px] "
            >
                <PurpleFileUploader
                    text="Upload picture"
                    types={["png", "jpg", "jpeg"]}
                    onTypeError={handleFileTypeError}
                    handleChange={handleUploaderChange}
                    busy={profilePicUpdateDetails.isLoading}
                />
                {profilePicState ? (
                    <PurpleButton
                        busy={profilePicUpdateDetails.isLoading}
                        onClick={handleRemovePicture}
                    >
                        Remove picture
                    </PurpleButton>
                ) : null}
                <FormError>{profilePicUpdateDetails.error}</FormError>
            </div>
        </RoundedContainer>
    );
}
