import React from "react";

export default function WavesLogoComponent({ className }) {
    return (
        <img
            className={`border-green-900 border- ${className}`}
            src="/logo.png"
            alt=""
        />
    );
}
