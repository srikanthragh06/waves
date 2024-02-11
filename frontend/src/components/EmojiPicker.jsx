// EmojiPickerComponent.js
import React from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { RiEmojiStickerLine } from "react-icons/ri";

export default function EmojiPicker({
    visible = false,
    setVisible,
    handleEmojiSelect,
    style,
}) {
    const handleButtonClick = (e) => {
        e.stopPropagation();
        setVisible((prev) => !prev);
    };

    const handleClickOutside = (e) => {
        setVisible((prev) => !prev);
    };

    return (
        <div className="text-white">
            <button type="button" onClick={(e) => handleButtonClick(e)}>
                <RiEmojiStickerLine className="w-7 h-7" />
            </button>
            {visible && (
                <div className=" fixed top-1/4 right-1/4 h-[200px] overflow-y-hidden">
                    <Picker
                        data={data}
                        onEmojiSelect={handleEmojiSelect}
                        onClickOutside={(e) => handleClickOutside(e)}
                        dynmaicWidth={true}
                        searchPosition={"none"}
                        previewPosition={"none"}
                        perLine={6}
                        navPosition={"none"}
                        // emojiButtonSize={12}
                        // emojiSize={12}
                    />
                </div>
            )}
        </div>
    );
}
