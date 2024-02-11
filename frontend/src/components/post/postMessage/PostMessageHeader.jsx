import React, { useContext } from "react";
import ProfilePic from "../../ProfilePic";
import { BsReply } from "react-icons/bs";
import { RiDeleteBin2Line } from "react-icons/ri";
import { ChatContext } from "../../../context/ChatProvider";
import { formatTimestamp } from "../../../utils/utils";

export default function PostMessageHeader({
    posterUsername,
    profilePicState,
    isUserMsg,
    message,
}) {
    const { deleteMessage, setReplyingMessageState } = useContext(ChatContext);

    return (
        <div
            className="w-ful bg-color4 py-2 px-4 rounded-t-lg
                            flex items-center space-x-8"
        >
            <ProfilePic
                src={profilePicState.pic}
                loadingState={profilePicState.isPending}
                className={`border-2 border-color3
                        w-[35px] h-[35px] sm:w-[55px] sm:h-[55px]`}
            />
            <header
                className="border- sm:text-xl w-full h-full
                flex justify-between items-center
                relative"
            >
                <p
                    className={
                        "text-white hover:font-normal hover:no-underline sm:text-lg text-base  cursor-pointer"
                    }
                >
                    {posterUsername}
                </p>
                <div className="flex flex-col">
                    <div className="flex sm:space-x-8 space-x-4 text-lg sm:text-xl w-full ">
                        <BsReply
                            className="cursor-pointer "
                            onClick={() =>
                                setReplyingMessageState({ ...message })
                            }
                        />
                        {isUserMsg && (
                            <RiDeleteBin2Line
                                className="cursor-pointer "
                                onClick={(e) => deleteMessage(message)}
                            />
                        )}
                    </div>
                    <p className="text-[12px] sm:text-[12px] text-right">
                        {formatTimestamp(message.createdAt)}
                    </p>
                </div>
            </header>
        </div>
    );
}
