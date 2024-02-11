import React, { useContext, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RiSendPlaneLine } from "react-icons/ri";
import EmojiPicker from "../../../components/EmojiPicker";
import { ChatContext } from "../../../context/ChatProvider";
import { GoFileMedia } from "react-icons/go";
import { FileUploader } from "react-drag-drop-files";

export default function ChatInput() {
    const {
        currentConversationState,
        sendMessage,
        setReplyingMessageState,
        replyingMessageState,
    } = useContext(ChatContext);

    const [messageContentState, setMessageContentState] = useState("");
    const [messageLoadingState, setMessageLoadingState] = useState(false);
    const [errorState, setErrorState] = useState("");

    const [emojiPickerVisibleState, setEmojiPickerVisibleState] =
        useState(false);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (messageContentState === "") return;

        setMessageLoadingState(true);
        await sendMessage(
            currentConversationState.id,
            messageContentState,
            null,
            [
                currentConversationState.userId1,
                currentConversationState.userId2,
            ],
            () => setErrorState(""),
            () => setErrorState("Failed to send message"),
            replyingMessageState.id
        );

        setReplyingMessageState({});
        setMessageContentState("");
        setMessageLoadingState(false);
    };

    const handleEmojiSelect = (emoji) => {
        setMessageContentState((prev) => prev + emoji.native);
    };

    const handleFileTypeError = () => {
        setErrorState("Incorrect file type"``);
    };

    const handleFileUploaderChange = async (file) => {
        setMessageLoadingState(true);

        await sendMessage(
            currentConversationState.id,
            "",
            file,
            [
                currentConversationState.userId1,
                currentConversationState.userId2,
            ],
            () => setErrorState(""),
            () => setErrorState("Failed to send message"),
            replyingMessageState.id
        );

        setMessageContentState("");
        setMessageLoadingState(false);
    };

    return (
        <>
            <p className="text-red-600 text-sm">{errorState}</p>
            {replyingMessageState?.id && (
                <div className="text-sm w-full  px-2 opacity-35 text-white border-2 rounded-lg py-1">
                    <p>
                        --Replying to @{replyingMessageState.sender?.username}
                    </p>
                    <div
                        className="truncate"
                        style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {replyingMessageState?.content}
                    </div>
                    <p
                        className="text-right text-sm cursor-pointer"
                        onClick={() => setReplyingMessageState({})}
                    >
                        Cancel
                    </p>
                </div>
            )}
            <form
                className="border-blue-900 border- py-4 px-2 flex items-center space-x-2 w-full"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(e);
                }}
            >
                <div className="flex flex-col items-center justify-evenly h-full">
                    <EmojiPicker
                        visible={emojiPickerVisibleState}
                        setVisible={setEmojiPickerVisibleState}
                        handleEmojiSelect={handleEmojiSelect}
                        style={{ position: "none" }}
                    />
                    <FileUploader
                        handleChange={handleFileUploaderChange}
                        onTypeError={handleFileTypeError}
                        types={["jpeg", "png", "jpg", "avi", "mp4", "mkv"]}
                    >
                        <GoFileMedia className="text-2xl cursor-pointer" />
                    </FileUploader>
                </div>
                <textarea
                    value={messageContentState}
                    onChange={(e) => setMessageContentState(e.target.value)}
                    style={{ resize: "none" }}
                    placeholder="Message Here..."
                    rows="3"
                    className=" text-base outline-none overflow-y-scroll
                flex 
                bg-color4 text-white w-full rounded-lg px-3 py-2"
                />
                {messageLoadingState ? (
                    <AiOutlineLoading3Quarters className="text-white text-3xl cursor-pointer animate-spin" />
                ) : (
                    <button>
                        <RiSendPlaneLine className="text-white text-3xl cursor-pointer" />
                    </button>
                )}
            </form>
        </>
    );
}
