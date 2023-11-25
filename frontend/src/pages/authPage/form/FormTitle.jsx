import React from "react";

export default function FormTitle({ className, children }) {
    return (
        <div
            className={`w-full p-2 flex justify-center items-center text-white text-center text-4xl ${className}`}
        >
            <h1 className="">{children}</h1>
        </div>
    );
}
