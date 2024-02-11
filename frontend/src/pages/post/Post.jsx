import React from "react";
import MainPage from "../../components/MainPage";
import PostItem from "../../components/post/PostItem";
import { useParams } from "react-router-dom";

export default function Post() {
    const { postId } = useParams();

    return (
        <MainPage className={"pt-6"}>
            <div
                className="w-full
            lg:max-w-[800px] 
            sm:max-w-[500px] 
            sm:py-2
            flex flex-col space-y-4
            border-"
            >
                <PostItem postId={postId} />
            </div>
        </MainPage>
    );
}
