import React, { useState } from "react";
import { createContext } from "react";
import { loginUser, signUpUser, updateUserDetails } from "../api/user";
import { getIsAuth } from "../api/user";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getAuthToken, removeAuthToken, setAuthToken } from "../utils/token";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [authInfoState, setAuthInfoState] = useState({
        profile: {},
        // profilePic: null,
        isLoggedIn: false,
        isPending: false,
        loginError: "",
        signUpError: "",
        authError: "",
        userUpdateError: "",
    });

    const navigate = useNavigate();

    const validateLoginCredentials = (usermail, password) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const usernameRegex = /^[a-zA-Z0-9_]{4,32}$/;
        const passwordRegex = /^.{6,32}$/;
        const result = {
            isEmail: false,
            isUsername: false,
            error: "",
        };
        if (!passwordRegex.test(password)) result.error = "Invalid credentials";
        if (emailRegex.test(usermail)) result.isEmail = true;
        else if (usernameRegex.test(usermail)) result.isUsername = true;
        else result.error = "Invalid credentials";
        return result;
    };

    const handleLogin = async (usermail, password) => {
        setAuthInfoState({ ...authInfoState, isPending: true });

        const { isUsername, isEmail, error } = validateLoginCredentials(
            usermail,
            password
        );
        if (error) {
            return setAuthInfoState({
                ...authInfoState,
                isPending: false,
                loginError: error || "Incorrect input format",
            });
        }
        if (isUsername) {
            var res = await loginUser({
                user: { username: usermail, password },
            });
        } else if (isEmail) {
            res = await loginUser({
                user: { email: usermail, password },
            });
        }

        if (res.error) {
            return setAuthInfoState({
                ...authInfoState,
                isPending: false,
                isLoggedIn: false,
                loginError: res.error,
                profile: {},
            });
        } else {
            setAuthToken(res.jwtToken);
            setAuthInfoState({
                ...authInfoState,
                isPending: false,
                isLoggedIn: true,
                loginError: "",
                profile: {
                    id: res.user.id,
                    username: res.user.username,
                    bio: res.user.bio,
                    gender: res.user.gender,
                    dateOfBirth: res.user.dateOfBirth,
                },
            });

            return navigate("/");
        }
    };

    const validateSignupCredentials = (
        username,
        email,
        password,
        gender,
        dateOfBirth
    ) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const usernameRegex = /^[a-zA-Z0-9_]{4,32}$/;
        const passwordRegex = /^.{6,32}$/;

        const result = {
            error: false,
        };
        if (!usernameRegex.test(username)) {
            result.error =
                "username can only contain alphanumeric characters and underscores. Usernames also can be only 4-32 characters long";
        } else if (!passwordRegex.test(password)) {
            result.error = "passwords have to be 6-32 characters long";
        } else if (!emailRegex.test(email)) {
            result.error = "Invalid email";
        }
        return result;
    };

    const handleSignup = async (
        username,
        email,
        password,
        confirmPassword,
        gender,
        dateOfBirth
    ) => {
        setAuthInfoState({ ...authInfoState, isPending: true });

        const { error } = validateSignupCredentials(
            username,
            email,
            password,
            gender,
            dateOfBirth
        );
        if (error) {
            return setAuthInfoState({
                ...authInfoState,
                isPending: false,
                signUpError: error,
            });
        }

        if (password !== confirmPassword) {
            return setAuthInfoState({
                ...authInfoState,
                isPending: false,
                signUpError: "password and confirm password do not match!",
            });
        }

        const res = await signUpUser({
            user: { username, email, password, gender, dateOfBirth },
        });
        if (res.error) {
            navigate("/auth");
            return setAuthInfoState({
                ...authInfoState,
                isPending: false,
                isLoggedIn: false,
                signUpError: res.error,
                profile: {},
            });
        } else {
            return setAuthInfoState({
                ...authInfoState,
                isPending: false,
                isLoggedIn: true,
                signUpError: "",
                profile: {
                    id: res.user.id,
                    username: res.user.username,
                    bio: res.user.bio,
                    gender: res.user.gender,
                    dateOfBirth: res.user.dateOfBirth,
                },
            });
        }
    };

    const isAuth = async () => {
        const token = getAuthToken();
        if (!token) return false;

        setAuthInfoState({
            ...authInfoState,
            isPending: true,
        });
        const res = await getIsAuth(token);
        if (res.error) {
            setAuthInfoState({
                ...authInfoState,
                isLoggedIn: false,
                isPending: false,
                authError: res.error,
            });
            return false;
        }

        setAuthInfoState({
            ...authInfoState,
            isLoggedIn: true,
            isPending: false,
            profile: {
                id: res.user.id,
                username: res.user.username,
                bio: res.user.bio,
                gender: res.user.gender,
                dateOfBirth: res.user.dateOfBirth,
            },
            authError: "",
        });
        return true;
    };

    const handleLogout = () => {
        setAuthInfoState({
            ...authInfoState,
            isLoggedIn: false,
            profile: {},
        });
        removeAuthToken();
        navigate("/auth");
    };

    const handleUserUpdate = async ({ username, dateOfBirth, bio, gender }) => {
        setAuthInfoState({ ...authInfoState, isPending: true });

        const token = getAuthToken();
        const res = await updateUserDetails(token, {
            user: { username, bio, gender, dateOfBirth },
        });
        if (res.error) {
            return setAuthInfoState({
                ...authInfoState,
                isPending: false,
                userUpdateError: res.error,
            });
        } else {
            return setAuthInfoState({
                ...authInfoState,
                isPending: false,
                userUpdateError: "",
                profile: {
                    id: res.user.id,
                    username: res.user.username,
                    bio: res.user.bio,
                    gender: res.user.gender,
                    dateOfBirth: res.user.dateOfBirth,
                },
            });
        }
    };

    useEffect(() => {
        const checkAuthStatus = async () => {
            const result = await isAuth();
            if (!result) navigate("/auth");
        };
        checkAuthStatus();
    }, [navigate]);

    return (
        <AuthContext.Provider
            value={{
                handleLogin,
                authInfoState,
                handleSignup,
                isAuth,
                handleLogout,
                handleUserUpdate,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
