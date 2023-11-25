import React from "react";

export default function WelcomeLeft({ className }) {
    const imageUrl = "/images/welcome.jpg";
    return (
        <div className={`relative  ${className}`}>
            <img
                src={imageUrl}
                alt=""
                className="w-full h-full object-cover opacity-40 "
            />
            <h1 className="absolute text-zinc-100 bottom-10 left-5 text-4xl font-bold font-serif">
                love, share, discover and connect!
            </h1>
        </div>
    );
}
