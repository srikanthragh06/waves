import { useContext, useEffect, useState } from "react";
import { GeneralMessageContext } from "../context/GeneralMessageProvider";

export default function GeneralMessageBox() {
    const {
        errorMessageState,
        setErrorMessageState,
        infoMessageState,
        setInfoMessageState,
    } = useContext(GeneralMessageContext);

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isVisible && (errorMessageState || infoMessageState)) {
            setTimeout(() => {
                setIsVisible(false);
                setErrorMessageState("");
                setInfoMessageState("");
            }, 2500);
        }
    }, [
        isVisible,
        errorMessageState,
        infoMessageState,
        setErrorMessageState,
        setInfoMessageState,
    ]);

    if (!isVisible) return null;
    return (
        <div
            className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                        w-[300px] h-[100px] z-50 bg-color4 rounded-lg border-color5 
                        border-4
                        flex justify-center items-center"
        >
            {errorMessageState && (
                <p className=" text-red-600">{errorMessageState}</p>
            )}
            {infoMessageState && (
                <p className=" text-green-600">{infoMessageState}</p>
            )}
        </div>
    );
}
