import { useState } from "react";
import EmojiPicker from "../../components/EmojiPicker";

export default function FormInput({
    className,
    inputState,
    setInputState,
    inputType = "text",
    name = "input",
    placeholder = "type here..",
    type = "text",
    options = [],
    rows = 1,
}) {
    const [emojiPickerVisibleState, setEmojiPickerVisibleState] =
        useState(false);

    if (inputType === "text") {
        return (
            <input
                className={`md:w-2/3 w-full outline-none bg-color3 px-2 py-1 rounded-sm ${className}`}
                type={type}
                name={name}
                placeholder={placeholder}
                value={inputState}
                onChange={(e) => setInputState(e.target.value)}
            />
        );
    } else if (inputType === "selection") {
        return (
            <select
                className={`md:w-2/3 w-full outline-none bg-color3 px-2 py-1 rounded-sm ${className}`}
                name={name}
                value={inputState}
                onChange={(e) => setInputState(e.target.value)}
            >
                {options.map((option) => {
                    return (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    );
                })}
            </select>
        );
    } else if (inputType === "textarea") {
        return (
            <div className={`relative  w-full md:w-2/3 ${className}`}>
                <textarea
                    className={`w-full outline-none bg-color3 px-2 py-1 rounded-sm  
                                ${className}`}
                    rows={rows}
                    style={{ resize: "none" }}
                    type="text"
                    placeholder={placeholder}
                    value={inputState}
                    onChange={(e) => setInputState(e.target.value)}
                />
                <div className="absolute bottom-0 right-0">
                    <EmojiPicker
                        visible={emojiPickerVisibleState}
                        setVisible={setEmojiPickerVisibleState}
                        handleEmojiSelect={(emoji) =>
                            setInputState((prev) => prev + emoji.native)
                        }
                    />
                </div>
            </div>
        );
    } else {
        return null;
    }
}
