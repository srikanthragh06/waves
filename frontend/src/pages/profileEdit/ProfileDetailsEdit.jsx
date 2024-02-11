import React, { useContext, useEffect, useState } from "react";
import FormInput from "../authPage/FormInput";
import PurpleButton from "../../components/PurpleButton";
import { getProfileDetailsApi, updateUserDetailsApi } from "../../api/user";
import { AuthContext } from "../../context/AuthProvider";
import { formatDate2 } from "../../utils/utils";
import { getAuthToken } from "../../utils/token";
import { useNavigate } from "react-router-dom";

export default function ProfileDetailsEdit() {
    const navigate = useNavigate();
    const { userDetailsState } = useContext(AuthContext);

    const [usernameInputState, setUsernameInputState] = useState("");
    const [bioInputState, setBioInputState] = useState("");
    const [genderInputState, setGenderInputState] = useState("Male");
    const [dateOfBirthInputState, setDateOfBirthInputState] = useState("");

    const [canSubmitState, setCanSubmitState] = useState(false);

    const [updateStatusState, setUpdateStatusState] = useState({
        error: "",
        isPending: false,
    });

    const setInputStates = async (profileId) => {
        const res = await getProfileDetailsApi(profileId);
        if (!res.data.error) {
            const { username, bio, gender, dateOfBirth } = res.data.user;
            setUsernameInputState(username);
            setBioInputState(bio);
            setGenderInputState(gender);
            setDateOfBirthInputState(formatDate2(dateOfBirth));
        }
    };

    const handleUpdateFormSubmit = async (e) => {
        e.preventDefault();
        setUpdateStatusState((prev) => {
            return { ...prev, isPending: true };
        });

        const userDetails = {
            user: {
                username: usernameInputState,
                bio: bioInputState,
                gender: genderInputState,
                dateOfBirth: dateOfBirthInputState,
            },
        };
        const token = getAuthToken();
        const res = await updateUserDetailsApi(token, userDetails);

        if (res.data.error) {
            setUpdateStatusState({ isPending: false, error: res.data.error });
        } else {
            setUpdateStatusState({ isPending: false, error: "" });
            navigate(`/profile/${userDetailsState.id}`);
        }
    };

    useEffect(() => {
        if (userDetailsState.id) setInputStates(userDetailsState.id);
    }, [userDetailsState.id]);

    useEffect(() => {
        if (userDetailsState.id) {
            if (
                userDetailsState.username === usernameInputState &&
                userDetailsState.bio === bioInputState &&
                userDetailsState.gender === genderInputState &&
                formatDate2(userDetailsState.dateOfBirth) ===
                    dateOfBirthInputState
            ) {
                setCanSubmitState(false);
            } else {
                setCanSubmitState(true);
            }
        }
    }, [
        userDetailsState,
        usernameInputState,
        bioInputState,
        genderInputState,
        dateOfBirthInputState,
    ]);

    return (
        <div
            className=" w-full
                lg:max-w-[800px] 
                sm:max-w-[500px]
                bg-color4 rounded-l
                flex justify-around items-center 
                py-4 px-4

                border-"
        >
            <form
                className="flex flex-col space-y-4 w-full items-center
                            text-base"
                onSubmit={
                    !canSubmitState
                        ? (e) => e.preventDefault()
                        : (e) => handleUpdateFormSubmit(e)
                }
            >
                <div className="flex w-full justify-between space-x-4">
                    <p className="text-lg">Username</p>
                    <FormInput
                        type="text"
                        placeholder=""
                        inputState={usernameInputState}
                        setInputState={setUsernameInputState}
                    />
                </div>
                <div className="flex w-full justify-between space-x-4">
                    <p className="text-lg">Bio</p>
                    <FormInput
                        inputType="textarea"
                        rows={"5"}
                        placeholder=""
                        inputState={bioInputState}
                        setInputState={setBioInputState}
                    />
                </div>
                <div className="flex w-full justify-between space-x-4">
                    <p className="text-lg">Gender</p>
                    <FormInput
                        inputType="selection"
                        options={["Male", "Female", "Others"]}
                        placeholder=""
                        inputState={genderInputState}
                        setInputState={setGenderInputState}
                    />
                </div>
                <div className="flex w-full justify-between space-x-4">
                    <p className="text-lg">Date of Birth</p>
                    <FormInput
                        type="date"
                        placeholder=""
                        inputState={dateOfBirthInputState}
                        setInputState={setDateOfBirthInputState}
                    />
                </div>

                <p className="text-red-900">{updateStatusState.error}</p>

                <PurpleButton
                    className={"text-lg sm:w-1/2 w-full"}
                    style={
                        !canSubmitState
                            ? { opacity: "0.2", cursor: "auto" }
                            : {}
                    }
                    loadingState={updateStatusState.isPending}
                >
                    Submit
                </PurpleButton>
            </form>
        </div>
    );
}
