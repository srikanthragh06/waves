import React from "react";
import { FileUploader } from "react-drag-drop-files";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function PurpleFileUploader({
    text,
    name,
    types,
    onTypeError,
    handleChange,
    className,
    busy,
}) {
    return (
        <FileUploader
            name={name}
            handleChange={handleChange}
            types={types}
            onTypeError={onTypeError}
            className="flex justify-center"
        >
            <p
                className={`bg-color2 sm:text-base text-sm px-2 py-1 rounded-md flex justify-center
                        text-white hover:opacity-80 transition cursor-pointer ${className}`}
            >
                {busy ? (
                    <AiOutlineLoading3Quarters className="animate-spin" />
                ) : (
                    text
                )}
            </p>
        </FileUploader>
    );
}
