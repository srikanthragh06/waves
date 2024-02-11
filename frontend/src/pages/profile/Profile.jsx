import React, { useContext } from "react";
import MainPage from "../../components/MainPage";
import ProfileInfoPart from "./ProfileInfoPart";
import ProfilePostsDisplay from "./ProfilePostsDisplay";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";
import AddPostButton from "./AddPostButton";

export default function Profile() {
    const { userDetailsState } = useContext(AuthContext);
    const { userId } = useParams();

    return (
        <MainPage
            className="space-y-6
                            border- z-20"
        >
            <ProfileInfoPart />
            {userDetailsState.id + "" === userId && <AddPostButton />}
            <ProfilePostsDisplay />
        </MainPage>
    );
}
