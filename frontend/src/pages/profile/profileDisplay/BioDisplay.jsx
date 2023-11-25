import React from "react";

export default function BioDisplay({ text, className }) {
    return (
        <div
            className={`sm:text-lg sm:text-left text-center text-base flex justify-center ${className}`}
        >
            <span>{text}</span>
        </div>
    );
}
