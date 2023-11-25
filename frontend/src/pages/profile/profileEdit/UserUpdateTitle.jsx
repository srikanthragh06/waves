import React from "react";

export default function UserUpdateTitle({ text, className }) {
    return (
        <div className={`flex justify-center text-xl ${className}`}>
            <h1>{text}</h1>
        </div>
    );
}
