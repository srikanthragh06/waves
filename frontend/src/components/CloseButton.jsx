import React from "react";
import { IoMdClose } from "react-icons/io";

export default function CloseButton({ onClick, className }) {
    return (
        <button>
            <IoMdClose
                onClick={() => onClick()}
                className={`text-white text-3xl hover:opacity-30 ${className}`}
            />
        </button>
    );
}
