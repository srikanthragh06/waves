import React from "react";
import MainPage from "../../components/MainPage";
import FeedPostsDisplay from "./FeedPostsDisplay";

export default function Home({ isVisible }) {
    return (
        <MainPage
            style={{
                // flexDirection: "row",
                display: isVisible ? "flex" : "none",
            }}
            className={`pt-4 border- `}
        >
            <div className="flex w-full justify-evenly">
                <FeedPostsDisplay />
            </div>
        </MainPage>
    );
}
