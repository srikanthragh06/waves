import React, { useContext, useState } from "react";
import ProfilePic from "../ProfilePic";
import { useNavigate } from "react-router-dom";
import { TbShare3 } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import { AuthContext } from "../../context/AuthProvider";
import DeletePostConfirmation from "./DeletePostConfirmation";

export default function PostHeader({
    postId,
    posterId,
    posterUsername,
    profilePicState,
}) {
    const navigate = useNavigate();
    const { userDetailsState } = useContext(AuthContext);

    const handleUsernameClick = async (e) => {
        if (posterId) {
            navigate(`/profile/${posterId}`);
        }
    };

    const [isDeletingPostState, setIsDeletingPostState] = useState(false);

    return (
        <div
            className="w-ful bg-color4 py-2 px-4 rounded-t-lg
                            flex items-center space-x-8"
        >
            <ProfilePic
                src={profilePicState.pic}
                loadingState={profilePicState.isPending}
                className={`border-2 border-color3
                        w-[55px] h-[55px] sm:w-[75px] sm:h-[75px]`}
            />
            <header
                className="border- sm:text-xl w-full h-full
                flex justify-between items-center
                relative"
            >
                <p
                    className={
                        "text-white hover:font-normal hover:no-underline text-xl cursor-pointer"
                    }
                    onClick={handleUsernameClick}
                >
                    {posterUsername}
                </p>
                <div className="flex sm:space-x-8 space-x-4 text-xl sm:text-2xl">
                    <TbShare3
                        className="cursor-pointer "
                        onClick={() => navigate(`/sharePost/${postId}`)}
                    />
                    {userDetailsState.id === posterId && (
                        <MdDelete
                            className="cursor-pointer "
                            onClick={() => setIsDeletingPostState(true)}
                        />
                    )}
                    {isDeletingPostState && (
                        <DeletePostConfirmation
                            setVisible={setIsDeletingPostState}
                            postId={postId}
                        />
                    )}
                </div>
            </header>
        </div>
    );
}
