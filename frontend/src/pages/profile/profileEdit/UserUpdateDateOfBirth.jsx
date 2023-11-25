import React from "react";

export default function UserUpdateDateOfBirth({
    className,
    userInfoState,
    setUserInfoState,
}) {
    return (
        <div className={`flex justify-between ${className}`}>
            <h1 className="sm:text-lg text-base w-1/2 text-left">
                Date of birth
            </h1>
            <input
                className="bg-color3 w-3/4 max-w-[300px] rounded-md outline-none 
                            sm:text-lg text-base text-center "
                type="date"
                value={userInfoState.dateOfBirth.slice(0, 10)}
                onChange={(e) =>
                    setUserInfoState({
                        ...userInfoState,
                        dateOfBirth: e.target.value,
                    })
                }
            />
        </div>
    );
}
