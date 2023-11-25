import React from "react";

export default function FormSelectInput({
    className,
    name = "",
    options = [],
    handleChange,
}) {
    return (
        <select
            name={name}
            className={`bg-color3 text-gray-400 px-1 py-1 rounded-md text-xl
                                outline-none focus:border-2 cursor-pointer w-5/6 sm:w-1/2 ${className}`}
            onChange={handleChange}
        >
            {options.map(({ value, text }) => (
                <option key={value} className="cursor-pointer" value={value}>
                    {text}
                </option>
            ))}
        </select>
    );
}
