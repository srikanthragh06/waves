import { useContext, useState } from "react";
import PurpleButton from "../../components/PurpleButton";
import AuthInput from "./FormInput";
import { signupUserApi } from "../../api/user";
import { AuthContext } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../../utils/token";

export default function SignUpForm() {
    const navigate = useNavigate();
    const { setUserDetailsState, setIsLoggedInState } = useContext(AuthContext);

    const [usernameInputState, setUsernameInputState] = useState("");
    const [emailInputState, setEmailInputState] = useState("");
    const [genderInputState, setGenderInputState] = useState("Male");
    const [dateOfBirthInputState, setDateOfBirthInputState] = useState("");
    const [passwordInputState, setPasswordInputState] = useState("");
    const [confirmPasswordInputState, setConfirmPasswordInputState] =
        useState("");

    const [signUpErrorState, setSignUpErrorState] = useState("");
    const [signUpPendingState, setSignUpPendingState] = useState(false);

    const handleFormSubmit = async (e) => {
        setSignUpPendingState(true);
        e.preventDefault();

        if (passwordInputState !== confirmPasswordInputState) {
            setSignUpErrorState("Password and Confirm Password do not match");
            return setSignUpPendingState(false);
        }

        const signUpDetails = {
            username: usernameInputState,
            email: emailInputState,
            gender: genderInputState,
            dateOfBirth: dateOfBirthInputState,
            password: passwordInputState,
        };
        const res = await signupUserApi({ user: signUpDetails });

        if (!res) {
            setSignUpErrorState("Network Error");
            setUserDetailsState({});
            setIsLoggedInState(false);
        } else if (res?.data.error) {
            setSignUpErrorState(res?.data.error);
            setUserDetailsState({});
            setIsLoggedInState(false);
        } else {
            setSignUpErrorState("");
            const { data } = res;
            setUserDetailsState({
                id: data.user.id,
                username: data.user.username,
                bio: data.user.bio,
                gender: data.user.gender,
                dateOfBirth: data.user.dateOfBirth,
                followers: data.user.followers,
                following: data.user.following,
                posts: data.user.posts,
            });
            setIsLoggedInState(true);
            setAuthToken(data.jwtToken);
            navigate("/");
        }

        return setSignUpPendingState(false);
    };

    return (
        <form
            onSubmit={handleFormSubmit}
            className=" w-full flex flex-col justify-center items-center h-full space-y-8
                text-lg
                border-"
        >
            <AuthInput
                type={"text"}
                placeholder={"Username"}
                name={"username"}
                inputState={usernameInputState}
                setInputState={setUsernameInputState}
            />
            <AuthInput
                type={"email"}
                placeholder={"Email ID"}
                name={"email"}
                inputState={emailInputState}
                setInputState={setEmailInputState}
            />
            <AuthInput
                inputType="selection"
                name="gender"
                options={["Male", "Female", "Others"]}
                inputState={genderInputState}
                setInputState={setGenderInputState}
            />
            <AuthInput
                name="dateOfBirth"
                type="date"
                inputState={dateOfBirthInputState}
                setInputState={setDateOfBirthInputState}
            />
            <AuthInput
                name="password"
                type="password"
                placeholder="Password"
                inputState={passwordInputState}
                setInputState={setPasswordInputState}
            />
            <AuthInput
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                inputState={confirmPasswordInputState}
                setInputState={setConfirmPasswordInputState}
            />
            <p className="text-red-800">{signUpErrorState}</p>
            <PurpleButton className={"w-1/2"} loadingState={signUpPendingState}>
                Sign Up
            </PurpleButton>
        </form>
    );
}
