import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import AuthPage from "./pages/authPage/AuthPage";
import GeneralMessageBox from "./components/GeneralMessageBox";
import Home from "./pages/home/Home";
import MainNavbar from "./navbar/MainNavbar";
import Profile from "./pages/profile/Profile";
import Post from "./pages/post/Post";
import ProfileEdit from "./pages/profileEdit/ProfileEdit";
import Following from "./pages/following/Following";
import Search from "./pages/search/Search";
import AddPost from "./pages/addPost/AddPost";
import Messages from "./pages/messages/Messages";
import SharePost from "./pages/sharePost/SharePost";
import NotFound from "./pages/notFound/NotFound";

export default function App() {
    const location = useLocation();
    const notNavbarPaths = ["/auth", "*"];
    const isHomeRoute = location.pathname === "/";

    useEffect(() => {}, []);

    return (
        <div
            className="flex flex-col space-y-2  w-screen h-screen bg-color5 text-white
        sm:flex-row sm:space-y-0 sm:space-x-0 sm:items-center
         overflow-auto"
        >
            <GeneralMessageBox />
            {!notNavbarPaths.includes(location.pathname) && <MainNavbar />}
            <Home isVisible={isHomeRoute} />
            <Routes>
                <Route path="/" element={null} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/post/:postId" element={<Post />} />
                <Route path="/addPost" element={<AddPost />} />
                <Route path="/profile/:userId" element={<Profile />} />
                <Route path="/following/:userId" element={<Following />} />
                <Route path="/profileEdit" element={<ProfileEdit />} />
                <Route path="/search" element={<Search />} />f
                <Route path="/messages" element={<Messages />} />
                <Route path="/sharePost/:postId" element={<SharePost />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}
