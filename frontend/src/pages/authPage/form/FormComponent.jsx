import React from "react";

export default function FormComponent({ className, children, handleSubmit }) {
    return (
        <form
            onSubmit={handleSubmit}
            className={` h-full flex flex-col justify-between items-center ${className}`}
            action=""
        >
            {children}
        </form>
    );
}
