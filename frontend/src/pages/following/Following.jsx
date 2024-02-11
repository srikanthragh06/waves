import React, { useState } from "react";
import MainPage from "../../components/MainPage";
import SwitchToggle from "../../components/SwitchToggle";
import FollowersListDisplay from "./FollowersListDisplay";
import FollowingListDisplay from "./FollowingListDisplay";

export default function Following() {
    const [isSearchingFollowers, setIsSearchingFollowers] = useState(true);

    return (
        <MainPage>
            <div
                className="w-full
                        lg:max-w-[800px] 
                        sm:max-w-[500px] 
                        sm:py-2
                        flex flex-col space-y-4"
            >
                <SwitchToggle
                    className="w-full"
                    toggleState={isSearchingFollowers}
                    setToggleState={setIsSearchingFollowers}
                    toggleTrueText={"Followers"}
                    toggleFalseText={"Following"}
                />

                {isSearchingFollowers ? (
                    <FollowersListDisplay />
                ) : (
                    <FollowingListDisplay />
                )}
            </div>
        </MainPage>
    );
}
