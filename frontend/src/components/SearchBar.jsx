import React from "react";
import { IoIosSearch } from "react-icons/io";

export default function SearchBar({
    searchTextState,
    setSearchTextState,
    placeholder,
    className,
    inputClassname,
}) {
    return (
        <div
            className={`flex justify-start px-3 py-2 items-center rounded-lg  bg-color4
                     ${className}`}
        >
            <IoIosSearch className="text-2xl mr-2" />
            <input
                onChange={(e) => setSearchTextState(e.target.value)}
                placeholder={placeholder}
                type="text"
                value={searchTextState}
                className={`outline-none bg-transparent text-lg text-md text-white w-full r
                sm:text-2xl ${inputClassname}`}
            />
        </div>
    );
}
