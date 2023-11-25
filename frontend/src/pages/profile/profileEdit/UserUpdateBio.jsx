import React from "react";

export default function UserUpdateBio({
    className,
    userInfoState,
    setUserInfoState,
}) {
    return (
        <div className="flex flex-row justify-between">
            <h1 className={`sm:text-lg text-base w-1/2 ${className}`}>Bio</h1>
            <textarea
                className="bg-color3 w-3/4 max-w-[300px] rounded-md outline-none text-base px-1 py-1  resize-none"
                rows={"7"}
                type="text"
                value={userInfoState.bio}
                onChange={(e) =>
                    setUserInfoState({
                        ...userInfoState,
                        bio: e.target.value,
                    })
                }
            />
        </div>
    );
}
