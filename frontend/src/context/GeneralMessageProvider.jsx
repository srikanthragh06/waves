import React, { createContext, useState } from "react";

export const GeneralMessageContext = createContext();

export default function GeneralMessageProvider({ children }) {
    const [errorMessageState, setErrorMessageState] = useState("");
    const [infoMessageState, setInfoMessageState] = useState("");

    return (
        <GeneralMessageContext.Provider
            value={{
                errorMessageState,
                setErrorMessageState,
                infoMessageState,
                setInfoMessageState,
            }}
        >
            {children}
        </GeneralMessageContext.Provider>
    );
}
