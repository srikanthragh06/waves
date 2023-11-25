import React from "react";

export default function UsernameDisplay({ text, className }) {
    return (
        <div
            className={`sm:text-2xl lg:text-3xl text-xl flex justify-center ${className}`}
        >
            <span>{text}</span>
        </div>
    );
}
