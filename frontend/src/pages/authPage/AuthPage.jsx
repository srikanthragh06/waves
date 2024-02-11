import React from "react";
import AuthWelcomeImage from "./AuthWelcomeImage";
import AuthPart from "./AuthPart";

export default function AuthPage() {
    return (
        <div
            className="w-full h-full flex justify-center items-center 
                        border-"
        >
            <div
                className=" bg-color4 rounded-lg
                            md:w-[90%] md:h-[90%]
                            w-full h-full
                            flex justify-between
                            border-"
            >
                <AuthWelcomeImage />
                <AuthPart />
            </div>
        </div>
    );
}
