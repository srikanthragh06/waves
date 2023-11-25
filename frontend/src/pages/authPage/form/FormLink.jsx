import React from "react";

export default function FormLink({ onClick, className, children }) {
    return (
        <p
            onClick={onClick}
            className={
                `text-color1 hover:underline hover:text-white transition 
                                        cursor-pointer ` + className
            }
        >
            {children}
        </p>
    );
}
