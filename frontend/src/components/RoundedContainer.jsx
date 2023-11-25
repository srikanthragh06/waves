import React from "react";

export default function RoundedContainer({ className, children }) {
    return (
        <div className={`bg-color4 overflow-hidden px-4 py-2 ${className}`}>
            {children}
        </div>
    );
}
