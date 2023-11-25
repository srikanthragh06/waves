import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function FormButton({
    className,
    busy,
    children,
    handleSubmit,
}) {
    return (
        <div
            className={`w-full text-black flex flex-row justify-center ${className}`}
        >
            <button
                className="bg-color1 text-white rounded-lg w-1/3 text-2xl py-1  
                hover:bg-color3
                flex justify-center"
                type="submit"
                onSubmit={handleSubmit}
            >
                {!busy ? (
                    children
                ) : (
                    <AiOutlineLoading3Quarters className="animate-spin" />
                )}
            </button>
        </div>
    );
}
