import React, { useState } from "react";
import WavesLogoComponent from "../../components/WavesLogoComponent";
import SwitchToggle2 from "../../components/SwitchToggle2";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

export default function AuthPart() {
    const [signInModeState, setSignInModeState] = useState(true);

    return (
        <div
            className="w-full md:w-1/2 px-4 py-2
                        flex flex-col space-y-4 justify-between items-center
                           border-"
        >
            {signInModeState && (
                <div className="flex flex-col justify-center items-center">
                    <WavesLogoComponent className={"w-[180px]"} />
                    <p className="text-[32px] font-cursive">Waves</p>
                </div>
            )}

            {signInModeState ? <SignInForm /> : <SignUpForm />}

            <SwitchToggle2
                toggleState={signInModeState}
                setToggleState={setSignInModeState}
                toggleTrueText={"Sign in"}
                toggleFalseText={"Sign up"}
                className={`w-full text-base sm:text-xl`}
            />
        </div>
    );
}
