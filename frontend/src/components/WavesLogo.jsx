import React from "react";

export default function WavesLogo({ className, textSize }) {
    const logoUrl = "/images/logo.png";
    return (
        <div className={`my-2 mx-1 ${className}`}>
            <img className="w-full" src={logoUrl} alt="" />
            <div
                className={`text-white font-cursive text-center text-2xl flex justify-center`}
                // style={{ fontSize: textSize || "2.5vw" }}
            >
                <p>Waves</p>
            </div>
        </div>
    );
}
