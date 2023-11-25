import React, { useState } from "react";

const SwitchToggle = () => {
    const [isChecked, setIsChecked] = useState(false);

    const toggleSwitch = () => {
        setIsChecked((prev) => !prev);
    };

    return (
        <label className="flex items-center cursor-pointer">
            <div
                className={`relative ${
                    isChecked ? "bg-blue-500" : "bg-gray-400"
                } rounded-full w-16 h-8 transition`}
                onClick={toggleSwitch}
            >
                <div
                    className={`absolute left-0 top-0 w-8 h-8 bg-white rounded-full shadow-md transition transform cursor-pointer flex items-center justify-center ${
                        isChecked ? "translate-x-8" : "translate-x-0"
                    }`}
                >
                    <span
                        className={`text-white ${
                            isChecked ? "text-blue-500" : "text-gray-400"
                        } font-bold transition`}
                    >
                        {isChecked ? "Sign Up" : "Login"}
                    </span>
                </div>
                <input
                    type="checkbox"
                    className="hidden"
                    checked={isChecked}
                    onChange={toggleSwitch}
                />
            </div>
        </label>
    );
};

export default SwitchToggle;
