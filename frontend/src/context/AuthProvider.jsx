import { createContext, useEffect, useState } from "react";
import { getAuthToken, removeAuthToken } from "../utils/token";
import { getIsAuthApi } from "../api/user";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [isLoggedInState, setIsLoggedInState] = useState(false);
    const [userDetailsState, setUserDetailsState] = useState({});

    const isAuth = async () => {
        const token = getAuthToken();
        if (!token) {
            setIsLoggedInState(false);
            setUserDetailsState({});
            return false;
        }

        const res = await getIsAuthApi(token);
        if (res?.data?.error) {
            setIsLoggedInState(false);
            setUserDetailsState({});
            return false;
        } else if (!res?.data?.error) {
            setIsLoggedInState(true);
            const data = res?.data;
            if (!data) return false;
            if (data.user) {
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
                return true;
            }
            return false;
        }
    };

    const handleLogout = () => {
        setUserDetailsState({});
        setIsLoggedInState(false);
        removeAuthToken();
        navigate("/auth");
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
                isLoggedInState,
                setIsLoggedInState,
                userDetailsState,
                setUserDetailsState,
                isAuth,
                handleLogout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
