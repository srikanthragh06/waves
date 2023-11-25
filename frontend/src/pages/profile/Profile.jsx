import React, { useState } from "react";
import RoundedContainer from "../../components/RoundedContainer";
import ProfilePicture from "../../components/ProfilePicture";
import ProfileInfo from "./profileDisplay/ProfileInfo";
import ProfileEditForm from "./profileEdit/ProfileEditForm";

export default function Profile() {
    const [isEditState, setIsEditState] = useState(false);
    return (
        <div
            className="text-white h-full w-full flex flex-col overflow-y-auto relative
                        sm:py-2 items-center border-4 border-blue-800"
        >
            <RoundedContainer
                className="bg-color5 w-full flex-shrink-0 flex justify-between items-center
                 sm:w-[90%] sm:max-w-[900px] border-red-800 border-2"
            >
                <ProfilePicture
                    className="lg:w-[175px] lg:h-[175px] 
                                sm:w-[125px] sm:h-[125px]
                                w-[100px] h-[100px] "
                />
                <ProfileInfo
                    isEditState={isEditState}
                    setIsEditState={setIsEditState}
                />
            </RoundedContainer>
            <ProfileEditForm
                visible={isEditState}
                setIsEditState={setIsEditState}
            />
        </div>
    );
}
