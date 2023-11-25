import React from "react";

export default function UserUpdateGender({
    className,
    userInfoState,
    setUserInfoState,
}) {
    return (
        <div className={`flex flex-row justify-between ${className}`}>
            <h1 className="sm:text-lg text-base w-1/2">Gender</h1>
            <select
                className="bg-color3 w-3/4 max-w-[300px] rounded-md outline-none 
                        text-base px-1 py-1  resize-none"
                rows={"7"}
                type="text"
                value={userInfoState.gender}
                onChange={(e) =>
                    setUserInfoState({
                        ...userInfoState,
                        gender: e.target.value,
                    })
                }
            >
                <option>Male</option>
                <option>Female</option>
                <option>Others</option>
            </select>
        </div>
    );
}
