import React, { useState } from "react";

import Signin from "./Signin";
import Signup from "./Signup";

export default function AuthRight({ children, className }) {
    const [toggleSignupState, setToggleSignupState] = useState(false);

    return (
        <>
            {toggleSignupState && (
                <Signup
                    className={`${className}`}
                    toggleSignupState={toggleSignupState}
                    setToggleSignupState={setToggleSignupState}
                />
            )}
            {!toggleSignupState && (
                <Signin
                    className={`${className}`}
                    toggleSignupState={toggleSignupState}
                    setToggleSignupState={setToggleSignupState}
                />
            )}
        </>
    );
}
