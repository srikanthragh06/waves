import React from "react";

export default function UserDetailsDisplay({ posts, friends, className }) {
    return (
        <div
            className={`sm:text-xl text-base flex justify-evenly  ${className}`}
        >
            <span className="text-center cursor-pointer">{posts} posts</span>
            <span className="text-center cursor-pointer">
                {friends} friends
            </span>
        </div>
    );
}
