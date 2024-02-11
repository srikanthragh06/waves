import React from "react";
import { useNavigate } from "react-router-dom";

export default function EditProfileButton() {
    const navigate = useNavigate();

    return (
        <button
            className="text-color1 hov
                                hover:text-white hover:underline transition"
            onClick={(e) => navigate("/profileEdit")}
        >
            Edit Profile
        </button>
    );
}
