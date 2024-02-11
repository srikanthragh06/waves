import React from "react";
import MainPage from "../../components/MainPage";
import ProfilePictureEdit from "./ProfilePictureEdit";
import ProfileDetailsEdit from "./ProfileDetailsEdit";
import ProfilePasswordEdit from "./ProfilePasswordEdit";

export default function ProfileEdit() {
    return (
        <MainPage className="sm:py-4 space-y-4 ">
            <ProfilePictureEdit />
            <ProfileDetailsEdit />
            <ProfilePasswordEdit />
        </MainPage>
    );
}
