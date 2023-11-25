import React from "react";

export default function FormInput({
    className,
    value,
    type,
    name,
    placeholder,
    label,
    handleChange,
}) {
    return (
        // <div className={`p-2 w-full flex flex-col items-center ${className}`}>
        //     {/* <label className="text-white text-left text-lg">{label}</label> */}
        //     <input
        //         className="outline-none bg-color3 text-white rounded-md w-5/6 sm:w-1/2 px-2 text-xl
        //                     focus:border-2 h-10"
        //         value={value}
        //         type={type}
        //         name={name}
        //         placeholder={placeholder}
        //         onChange={handleChange}
        //     />
        // </div>
        <input
            className="outline-none bg-color3 text-white rounded-md w-5/6 sm:w-1/2 px-2 text-xl
                    focus:border-2 h-10"
            value={value}
            type={type}
            name={name}
            placeholder={placeholder}
            onChange={handleChange}
        />
    );
}
