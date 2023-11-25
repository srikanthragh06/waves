import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function PurpleButton({ className, children, onClick, busy }) {
    return (
        <button
            className={`bg-color2 sm:text-base text-sm px-2 py-1 rounded-md flex justify-center
                    text-white hover:opacity-80 transition cursor-pointer ${className}`}
            onClick={onClick}
        >
            {busy ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
            ) : (
                children
            )}
        </button>
    );
}
