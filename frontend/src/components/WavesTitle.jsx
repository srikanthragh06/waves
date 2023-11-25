import React from "react";

export default function WavesTitle({ className }) {
    return (
        <div className={`px-2 py-2  ${className}`}>
            <p
                className={`text-white font-cursive text-center text-5xl flex justify-center`}
            >
                Waves
            </p>
        </div>
    );
}
