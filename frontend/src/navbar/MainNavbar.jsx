import WavesTitle from "../components/WavesTitle";
import { MdLogout } from "react-icons/md";
import { LuHome } from "react-icons/lu";
import { IoIosSearch } from "react-icons/io";
import { BiMessageSquareDots } from "react-icons/bi";
import { FiUser } from "react-icons/fi";
import NavButton from "./NavButton";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";

export default function MainNavbar() {
    const { handleLogout, userDetailsState } = useContext(AuthContext);
    const navigate = useNavigate();
    return (
        <nav
            className=" bg-color4 text-white 
                        sm:h-full sm:w-auto sm:flex sm:flex-col sm:justify-evenly  sm:items-start 
                                                sm:px-3 sm:py-3 
                        w-full h-[10%] flex flex-row justify-between items-center px-2 py-4 overflow-y-visibl
                            sticky top-0 "
        >
            <WavesTitle className={"hidden sm:block -top-[50px] relative"} />

            <NavButton
                Logo={LuHome}
                text="Home"
                onClick={() => navigate("/")}
            />
            {/* <NavButton Logo={MdOutlineNotificationsNone} text="Notification" /> */}
            <NavButton
                Logo={IoIosSearch}
                text="Search"
                onClick={() => navigate("/search")}
            />
            <NavButton
                Logo={BiMessageSquareDots}
                text="Messages"
                onClick={() => navigate("/messages")}
            />
            <NavButton
                Logo={FiUser}
                text={userDetailsState.username || "Profile"}
                onClick={() => navigate(`/profile/${userDetailsState.id}`)}
            />
            <NavButton Logo={MdLogout} text="Log out" onClick={handleLogout} />
        </nav>
    );
}
