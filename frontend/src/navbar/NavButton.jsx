import React from "react";

export default function NavButton({
    Logo,
    text,
    onClick,
    textSize = "",
    buttonSize = "",
}) {
    return (
        <button
            className={`text-2xl ${buttonSize} flex items-center space-x-1 hover:text-color1`}
            onClick={onClick}
        >
            {Logo ? <Logo className={`text-3xl w-[30px] ${textSize}`} /> : null}
            <span className="hidden sm:block">{text}</span>
        </button>
    );
}
