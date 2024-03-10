import { useContext, useState } from "react";
import FormInput from "./FormInput";
import { loginUserApi } from "../../api/user";
import PurpleButton from "../../components/PurpleButton";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";
import { setAuthToken } from "../../utils/token";
import { isEmail } from "../../utils/utils";

export default function SignInForm() {
    const navigate = useNavigate();
    const { setUserDetailsState, setIsLoggedInState } = useContext(AuthContext);

    const handleFormSubmit = async (e) => {
        setSignInPendingState(true);
        e.preventDefault();

        if (isEmail(usermailInputState)) {
            var res = await loginUserApi({
                user: {
                    email: usermailInputState,
                    password: passwordInputState,
                },
            });
        } else {
            res = await loginUserApi({
                user: {
                    username: usermailInputState,
                    password: passwordInputState,
                },
            });
        }
        if (!res) {
            setSignInErrorState("Network Error");
            setUserDetailsState({});
            setIsLoggedInState(false);
        } else if (res?.data.error) {
            setSignInErrorState(res?.data?.error);
            setUserDetailsState({});
            setIsLoggedInState(false);
        } else {
            setSignInErrorState("");
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

        return setSignInPendingState(false);
    };

    const [usermailInputState, setUsermailInputState] = useState("");
    const [passwordInputState, setPasswordInputState] = useState("");
    const [signInErrorState, setSignInErrorState] = useState("");
    const [signInPendingState, setSignInPendingState] = useState(false);

    return (
        <form
            onSubmit={handleFormSubmit}
            className=" w-full flex flex-col justify-center items-center h-full space-y-8
                        text-lg
                        border-"
        >
            <FormInput
                type={"text"}
                placeholder={"username or email ID"}
                name={"usermail"}
                inputState={usermailInputState}
                setInputState={setUsermailInputState}
            />
            <FormInput
                type={"password"}
                placeholder={"password"}
                name={"password"}
                inputState={passwordInputState}
                setInputState={setPasswordInputState}
            />

            <p className="text-red-800">{signInErrorState}</p>
            <PurpleButton className={"w-1/2"} loadingState={signInPendingState}>
                Log in
            </PurpleButton>
        </form>
    );
}
