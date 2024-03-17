import React from "react";

export default function AuthWelcomeImage() {
    return (
        <div
            className="relative hidden md:block w-1/2
                        border-"
        >
            <img
                className="w-full h-full object-cover opacity-60"
                src="/welcome.jpg"
                alt=""
            />
            <p
                className="absolute left-[5%] bottom-[15%] 
                             text-[40px] font-bold "
                style={{ lineHeight: "1.2" }}
            >
                Like none another!
            </p>
        </div>
    );
}
