import React, { useContext } from "react";
import PurpleButton from "../../../components/PurpleButton";
import { AuthContext } from "../../../context/AuthProvider";

export default function UserUpdateSubmitButton({ onClick, submitModeState }) {
    const { authInfoState } = useContext(AuthContext);
    return (
        <div className="flex justify-center relative">
            {submitModeState ? (
                <PurpleButton
                    onClick={onClick}
                    className=" w-60"
                    busy={authInfoState.isPending}
                >
                    Submit
                </PurpleButton>
            ) : null}
            {!submitModeState ? (
                <PurpleButton
                    onClick={() => {}}
                    className=" w-60 opacity-25 cursor-default hover:opacity-25"
                >
                    Submit
                </PurpleButton>
            ) : null}
        </div>
    );
}
