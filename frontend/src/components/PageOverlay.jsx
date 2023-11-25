import React from "react";

export default function PageOverlay({ children, className }) {
    return (
        <div
            className={`absolute top-0 bottom-0 left-0 right-0 bg-black bg-opacity-80 z-20
                        flex flex-col justify-start items-center overlay ${className}`}
        >
            {children}
        </div>
    );
}
