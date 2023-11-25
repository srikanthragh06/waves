import React from "react";

export default function UserUpdateUsername({
    className,
    userInfoState,
    setUserInfoState,
}) {
    return (
        <div className="flex justify-between">
            <h1 className={`sm:text-lg text-base w-1/2 text-left ${className}`}>
                Username
            </h1>
            <input
                className="bg-color3 w-3/4 max-w-[300px] rounded-md outline-none sm:text-lg 
                                text-base text-center "
                type="text"
                name="username"
                value={userInfoState.username}
                onChange={(e) =>
                    setUserInfoState({
                        ...userInfoState,
                        username: e.target.value,
                    })
                }
            />
        </div>
    );
}
