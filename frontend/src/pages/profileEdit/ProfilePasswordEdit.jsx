import React, { useEffect, useState } from "react";
import FormInput from "../authPage/FormInput";
import PurpleButton from "../../components/PurpleButton";
import { getAuthToken } from "../../utils/token";
import { changePasswordApi } from "../../api/user";

export default function ProfilePasswordEdit() {
    const [oldPasswordInputState, setOldPasswordInputState] = useState("");
    const [newPasswordInputState, setNewPasswordInputState] = useState("");
    const [confirmNewPasswordInputState, setConfirmNewPasswordInputState] =
        useState("");

    const [canSubmitState, setCanSubmitState] = useState(false);

    const [updateStatusState, setUpdateStatusState] = useState({
        error: "",
        info: "",
        isPending: false,
    });

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setUpdateStatusState((prev) => {
            return { ...prev, isPending: true };
        });

        const token = getAuthToken();
        const res = await changePasswordApi(
            token,
            oldPasswordInputState,
            newPasswordInputState
        );

        if (res.data.error) {
            setUpdateStatusState({
                isPending: false,
                error: res.data.error,
                info: "",
            });
        } else {
            setUpdateStatusState({
                isPending: false,
                info: res.data.message,
                error: "",
            });
        }
    };

    useEffect(() => {
        if (
            oldPasswordInputState === "" ||
            newPasswordInputState === "" ||
            confirmNewPasswordInputState === "" ||
            newPasswordInputState !== confirmNewPasswordInputState ||
            oldPasswordInputState === newPasswordInputState
        ) {
            setCanSubmitState(false);
        } else {
            setCanSubmitState(true);
        }
    }, [
        oldPasswordInputState,
        newPasswordInputState,
        confirmNewPasswordInputState,
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
                className="flex flex-col space-y-4 w-full items-center text-base"
                onSubmit={
                    !canSubmitState
                        ? (e) => e.preventDefault()
                        : (e) => handleFormSubmit(e)
                }
            >
                <div className="flex w-full justify-between space-x-4">
                    <p className="text-lg">Old Password</p>
                    <FormInput
                        type="password"
                        placeholder=""
                        inputState={oldPasswordInputState}
                        setInputState={setOldPasswordInputState}
                    />
                </div>
                <div className="flex w-full justify-between space-x-4">
                    <p className="text-lg">New Password</p>
                    <FormInput
                        type="password"
                        placeholder=""
                        inputState={newPasswordInputState}
                        setInputState={setNewPasswordInputState}
                    />
                </div>
                <div className="flex w-full justify-between space-x-4">
                    <p className="text-lg">Confirm New Password</p>
                    <FormInput
                        type="password"
                        placeholder=""
                        inputState={confirmNewPasswordInputState}
                        setInputState={setConfirmNewPasswordInputState}
                    />
                </div>

                <p className="text-green-600">{updateStatusState.info}</p>
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
                    Change Password
                </PurpleButton>
            </form>
        </div>
    );
}
