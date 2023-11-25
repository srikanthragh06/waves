import React, { useContext } from "react";
import WavesTitle from "../components/WavesTitle";
import { MdLogout } from "react-icons/md";
import { LuHome } from "react-icons/lu";
import { MdOutlineNotificationsNone } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { BiMessageSquareDots } from "react-icons/bi";
import { FiUser } from "react-icons/fi";
import NavButton from "./NavButton";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function MainNavbar({ className, children }) {
    const { handleLogout, authInfoState } = useContext(AuthContext);
    const navigate = useNavigate();
    return (
        <nav
            className=" bg-color4 text-white 
                        sm:h-full sm:w-auto sm:flex sm:flex-col sm:justify-evenly  sm:items-start 
                                                sm:px-3 sm:py-3 
                        w-full h-[10%] flex flex-row justify-between items-center px-2 py-4 overflow-y-visible
                            sticky top-0"
        >
            <WavesTitle className={"hidden sm:block -top-[50px] relative"} />

            <NavButton
                Logo={LuHome}
                text="Home"
                onClick={() => navigate("/")}
            />
            <NavButton Logo={MdOutlineNotificationsNone} text="Notification" />
            <NavButton Logo={IoIosSearch} text="Search" />
            <NavButton Logo={BiMessageSquareDots} text="Messages" />
            <NavButton
                Logo={FiUser}
                text={authInfoState?.profile?.username || "Profile"}
                onClick={() => navigate("/profile")}
            />
            <NavButton Logo={MdLogout} text="Log out" onClick={handleLogout} />
        </nav>
    );
}
