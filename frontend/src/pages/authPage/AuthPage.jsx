import React from "react";
import WelcomeLeft from "./WelcomeLeft";
import RoundedContainer from "../../components/RoundedContainer";
import AuthRight from "./AuthRight";

export default function AuthPage() {
    return (
        <div className="flex w-full items-center justify-center h-screen">
            <RoundedContainer className=" sm:w-[85%] sm:h-[85%] w-full h-full flex justify-around px-0 py-0">
                <WelcomeLeft className="w-full  hidden md:block" />
                <AuthRight
                    className={
                        "w-full flex flex-col justify-evenly items-center"
                    }
                />
            </RoundedContainer>
            <div className="hidden sm:block text-[12px] absolute bottom-2 right-2 text-white">
                By Srikanth Raghavan
            </div>
        </div>
    );
}
