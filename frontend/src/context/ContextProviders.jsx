import React from "react";
import AuthProvider from "./AuthProvider";
import ProfilePictureProvider from "./ProfilePictureProvider";

export default function ContextProviders({ children }) {
    return (
        <AuthProvider>
            <ProfilePictureProvider>{children}</ProfilePictureProvider>
        </AuthProvider>
    );
}
