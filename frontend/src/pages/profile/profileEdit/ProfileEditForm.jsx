import React from "react";
import PageOverlay from "../../../components/PageOverlay";
import RoundedContainer from "../../../components/RoundedContainer";
import CloseButton from "../../../components/CloseButton";
import PurpleButton from "../../../components/PurpleButton";
import ProfilePictureEdit from "./ProfilePictureEdit";
import UserDetailsForm from "./UserUpdateForm";

export default function ProfileEditForm({ visible, setIsEditState }) {
    if (!visible) return null;

    return (
        <PageOverlay>
            <RoundedContainer
                className="sm:w-[55%] w-full h-full overflow-y-scroll sm:h-[100%] bg-color5 rounded-sm relative
                                border-green-900  "
            >
                <CloseButton
                    className="absolute top-1 right-1"
                    onClick={() => setIsEditState(false)}
                />
                <div className="my-2 flex flex-col space-y-2 items-center  border-blue-900 ">
                    <ProfilePictureEdit />
                    <UserDetailsForm />
                    <PurpleButton className="bg-red-900">
                        Delete User
                    </PurpleButton>
                </div>
            </RoundedContainer>
        </PageOverlay>
    );
}
