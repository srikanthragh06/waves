import React from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function AddPostButton() {
    const navigate = useNavigate();

    return (
        <div
            onClick={(e) => navigate("/addPost")}
            className="
                    border-2 border-white text-white rounded-md opacity-70
                    flex items-center justify-center
                    sm:space-x-5 space-x-2 
                    sm:px-5 sm:py-3 py-3 px-2 cursor-pointer
                    hover:opacity-100 transition"
        >
            <span className="sm:text-2xl text-lg">Add Post</span>
            <FaPlus className="sm:text-2xl text-xl " />
        </div>
    );
}
