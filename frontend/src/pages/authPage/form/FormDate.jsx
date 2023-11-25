import React from "react";

export default function FormDate({ handleChange, name }) {
    return (
        <input
            name={name}
            onChange={handleChange}
            type="date"
            className="bg-color3 text-gray-400 px-1 py-1 rounded-md text-xl
                                outline-none focus:border-2 cursor-pointer w-5/6 sm:w-1/2"
        />
    );
}
