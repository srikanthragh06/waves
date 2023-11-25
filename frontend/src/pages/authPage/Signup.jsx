import React, { useContext } from "react";
import FormComponent from "./form/FormComponent";
import FormButton from "./form/FormButton";
import FormInput from "./form/FormInput";
import FormTitle from "./form/FormTitle";
import { useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import FormError from "./form/FormError";
import FormLink from "./form/FormLink";
import FormSelectInput from "./form/FormSelectInput";
import FormDate from "./form/FormDate";

export default function Signup({
    className,
    toggleSignupState,
    setToggleSignupState,
}) {
    const { handleSignup, authInfoState } = useContext(AuthContext);
    const [signupInfoState, setSignupInfoState] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        gender: "Male",
        dateOfBirth: "",
    });

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        await handleSignup(
            signupInfoState.username,
            signupInfoState.email,
            signupInfoState.password,
            signupInfoState.confirmPassword,
            signupInfoState.gender,
            signupInfoState.dateOfBirth
        );
    };

    const handleChangeSignupInput = (e) => {
        const { target } = e;
        const { name, value } = target;
        setSignupInfoState({ ...signupInfoState, [name]: value });
    };

    return (
        <div
            className={`w-full h-full flex flex-col justify-end  ${className}`}
        >
            <FormComponent
                className={"w-full h-[94.5%] "}
                handleSubmit={(e) => handleSignupSubmit(e)}
            >
                <FormTitle className={""}>Sign up</FormTitle>
                <FormInput
                    className={""}
                    type="text"
                    name="username"
                    placeholder="Username*"
                    label="Username"
                    value={signupInfoState.username}
                    handleChange={handleChangeSignupInput}
                />
                <FormInput
                    className={""}
                    type="email"
                    name="email"
                    placeholder="Email*"
                    label="Email"
                    value={signupInfoState.email}
                    handleChange={handleChangeSignupInput}
                />
                <FormInput
                    className={""}
                    type="password"
                    name="password"
                    placeholder="Password* ( 6-32 characters )"
                    label="Password"
                    value={signupInfoState.password}
                    handleChange={handleChangeSignupInput}
                />
                <FormInput
                    className={""}
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password*"
                    label="Confirm Password"
                    value={signupInfoState.confirmPassword}
                    handleChange={handleChangeSignupInput}
                />

                <FormSelectInput
                    name="gender"
                    handleChange={handleChangeSignupInput}
                    options={[
                        { value: "Male", text: "Male" },
                        { value: "Female", text: "Female" },
                        { value: "Others", text: "Others" },
                    ]}
                />
                <FormDate
                    handleChange={handleChangeSignupInput}
                    name="dateOfBirth"
                />
                <FormError>{authInfoState.signUpError}</FormError>
                <FormButton className={""} busy={authInfoState.isPending}>
                    Register
                </FormButton>
                <div className="w-full text-center flex flex-row justify-around items-center ">
                    <FormLink
                        onClick={() => setToggleSignupState(!toggleSignupState)}
                    >
                        Sign in
                    </FormLink>
                </div>
            </FormComponent>
        </div>
    );
}
