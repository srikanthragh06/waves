import React from "react";
import { useNavigate } from "react-router-dom";
import { getIdThroughUsernameApi } from "../api/user";

export default function UsernameLink({ children, className }) {
    const navigate = useNavigate();

    const handleLinkClick = async (e) => {
        const username = e.target.textContent?.slice(1);
        if (!username) return;
        const res = await getIdThroughUsernameApi(username);
        if (res.data.error) return;

        const { userId } = res.data;
        navigate(`/profile/${userId}`);
    };

    return (
        <span
            className={`text-color1 cursor-pointer 
                    hover:font-bold hover:underline ${className}`}
            onClick={handleLinkClick}
        >
            {children}
        </span>
    );
}
