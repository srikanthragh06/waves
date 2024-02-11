import React from "react";
import GeneralMessageProvider from "./GeneralMessageProvider";
import AuthProvider from "./AuthProvider";
import ChatProvider from "./ChatProvider";

export default function ContextProviders({ children }) {
    return (
        <GeneralMessageProvider>
            <AuthProvider>
                <ChatProvider>{children}</ChatProvider>
            </AuthProvider>
        </GeneralMessageProvider>
    );
}
