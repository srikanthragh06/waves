import React from "react";

export default function WavesLogo2({ className, textSize }) {
    const logoUrl = "/images/logo.png";
    return (
        <div className={` ${className}`}>
            <img className="" src={logoUrl} alt="" />
        </div>
    );
}
