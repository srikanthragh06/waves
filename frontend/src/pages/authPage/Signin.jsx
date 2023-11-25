import React, { useContext } from "react";
import WavesLogo from "../../components/WavesLogo";
import FormComponent from "./form/FormComponent";
import FormButton from "./form/FormButton";
import FormInput from "./form/FormInput";
import FormTitle from "./form/FormTitle";
import { useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import FormError from "./form/FormError";
import FormLink from "./form/FormLink";

export default function Signin({
    className,
    toggleSignupState,
    setToggleSignupState,
}) {
    const { handleLogin, authInfoState } = useContext(AuthContext);
    const [loginInfoState, setLoginInfoState] = useState({
        usermail: "",
        password: "",
    });

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        await handleLogin(loginInfoState.usermail, loginInfoState.password);
    };

    const handleChangeLoginInput = (e) => {
        const { target } = e;
        const { name, value } = target;
        setLoginInfoState({ ...loginInfoState, [name]: value });
    };

    return (
        <div className={`w-full flex flex-col justify-around`}>
            <div className=" w-full  flex justify-center ">
                <WavesLogo className={" w-[150px] "} />
            </div>
            <div className=" w-full h-[60%] flex flex-col ">
                <FormComponent
                    className={"justify-end"}
                    handleSubmit={(e) => handleLoginSubmit(e)}
                >
                    <FormTitle className={""}>Sign in</FormTitle>
                    <div className="w-full h-1/2 flex flex-col justify-between  items-center">
                        <FormInput
                            className={""}
                            type="text"
                            name="usermail"
                            placeholder="Username or Email"
                            label="Username or Email"
                            value={loginInfoState.usermail}
                            handleChange={handleChangeLoginInput}
                        />
                        <FormInput
                            className={""}
                            type="password"
                            name="password"
                            placeholder="Password"
                            label="Password"
                            value={loginInfoState.password}
                            handleChange={handleChangeLoginInput}
                        />
                        <FormButton
                            className={"mt-5"}
                            busy={authInfoState.isPending}
                        >
                            Log in
                        </FormButton>
                    </div>
                    <FormError>{authInfoState.loginError}</FormError>

                    <div className="w-full text-center flex flex-row justify-around items-center my-1 ">
                        <FormLink
                            onClick={() =>
                                setToggleSignupState(!toggleSignupState)
                            }
                        >
                            Sign up!
                        </FormLink>
                        <FormLink>Forget password?</FormLink>
                    </div>
                </FormComponent>
            </div>
        </div>
    );
}
