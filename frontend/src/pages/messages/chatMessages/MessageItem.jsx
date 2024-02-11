import { useContext } from "react";
import { AuthContext } from "../../../context/AuthProvider";
import { formatTimestamp } from "../../../utils/utils";
import PostMessageItem from "../../../components/post/postMessage/PostMessageItem";
import { ChatContext } from "../../../context/ChatProvider";
import MessageMedia from "./MessageMedia";

export default function MessageItem({ message }) {
    const { deleteMessage, setReplyingMessageState } = useContext(ChatContext);
    const { userDetailsState } = useContext(AuthContext);

    const isUserMsg = userDetailsState.id === message.senderId;

    console.log(message.replyMessage);

    return (
        <div className="text-white border- flex items-center">
            {message.postId ? (
                <PostMessageItem
                    message={message}
                    isUserMsg={isUserMsg}
                    postId={message.postId}
                />
            ) : (
                <div
                    style={
                        isUserMsg
                            ? { marginLeft: "auto", borderColor: "color2" }
                            : {}
                    }
                    className="px-4 w-4/5 lg:w-2/5 sm:w-1/2 py-2 border- bg-color3 rounded-md
                                    relative"
                >
                    {message.replyMessage && (
                        <div className="text-sm  px-2 opacity-35 text-white border-2 rounded-lg py-1 mb-2">
                            <p>
                                --Replying to @
                                {message.replyMessage.sender?.username}
                            </p>
                            <div
                                className="truncate"
                                style={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 1,
                                    WebkitBoxOrient: "vertical",
                                    whiteSpace: "pre-line",
                                }}
                            >
                                {message.replyMessage?.content}
                            </div>
                        </div>
                    )}
                    {message.mediaFileName ? (
                        <MessageMedia message={message} />
                    ) : (
                        <p className="text-base sm:text-lg text-left break-words">
                            {message.content}
                        </p>
                    )}

                    <p className="text-[12px] sm:text-[12px] text-right">
                        {formatTimestamp(message.createdAt)}
                    </p>

                    <div className="flex justify-between mt-1">
                        <p
                            className="text-[12px] text-white cursor-pointer hover:text-color5
                                    border-"
                            onClick={() =>
                                setReplyingMessageState({ ...message })
                            }
                        >
                            Reply
                        </p>
                        {isUserMsg && (
                            <p
                                className="text-[12px] text-white cursor-pointer hover:text-red-600
                                    border-"
                                onClick={(e) => deleteMessage(message)}
                            >
                                Delete
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
