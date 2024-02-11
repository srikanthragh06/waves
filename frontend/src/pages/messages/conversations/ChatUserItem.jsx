import React, { useContext, useEffect, useState } from "react";
import { getProfilePictureApi } from "../../../api/user";
import ProfilePic from "../../../components/ProfilePic";
import { AuthContext } from "../../../context/AuthProvider";
import { ChatContext } from "../../../context/ChatProvider";

export default function ChatUserItem({ conversation }) {
    const {
        changeCurrentConversation,
        setCurrentConversationProfilePicState,
        changeIsChatting,
    } = useContext(ChatContext);

    const { userDetailsState } = useContext(AuthContext);

    let chatUsername, chatId, isRead;

    if (conversation.user1.id === userDetailsState.id) {
        chatId = conversation.user2.id;
        chatUsername = conversation.user2.username;
        isRead = conversation.userId1IsRead;
    } else {
        chatId = conversation.user1.id;
        chatUsername = conversation.user1.username;
        isRead = conversation.userId2IsRead;
    }

    const [profilePicState, setProfilePicState] = useState({
        pic: null,
        isPending: false,
        error: "",
    });

    const setProfilePicture = async (profileId) => {
        setProfilePicState((prev) => {
            return {
                ...prev,
                pic: null,
                isPending: true,
            };
        });
        const res = await getProfilePictureApi(profileId);
        if (!res.error) {
            const picURL = URL.createObjectURL(res);
            return setProfilePicState((prev) => {
                return {
                    pic: picURL,
                    isPending: false,
                    error: "",
                };
            });
        }

        setProfilePicState((prev) => {
            return {
                ...prev,
                isPending: false,
                error: res.error,
            };
        });
    };

    useEffect(() => {
        if (chatId) setProfilePicture(chatId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatId]);

    return (
        <div
            className="text-white bg-color4 flex flex-row justify-between px-4 py-2 w-full border-2
                items-center border-color5 border-y- rounded-md 
                cursor-pointer transition hover:opacity-80"
            onClick={(e) => {
                changeCurrentConversation({ ...conversation });
                setCurrentConversationProfilePicState({
                    pic: profilePicState.pic,
                    isPending: false,
                    error: profilePicState.error,
                });
                changeIsChatting(true);
            }}
        >
            <ProfilePic
                className={"sm:w-[80px] sm:h-[80px] w-[60px] h-[60px]"}
                src={profilePicState.pic}
                loadingState={profilePicState.isPending}
            />
            <div
                className="flex flex-col justify justify- space-y-4
                         items-center border- w-full h-full "
            >
                <p className="text-base sm:text-lg ">{chatUsername}</p>
                <p
                    style={
                        isRead
                            ? {
                                  opacity: "0.5",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                              }
                            : {
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  fontWeight: "bold",
                              }
                    }
                    className="text-sm w-[150px] sm:w-[250px] text-center border- "
                >
                    {conversation.lastMessage}
                </p>
            </div>
        </div>
    );
}
