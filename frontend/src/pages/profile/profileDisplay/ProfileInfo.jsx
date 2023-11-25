import { useContext } from "react";
import { AuthContext } from "../../../context/AuthProvider";
import FormLink from "../../authPage/form/FormLink";
import UsernameDisplay from "./UsernameDisplay";
import BioDisplay from "./BioDisplay";
import UserDetailsDisplay from "./UserDetailsDisplay";

export default function ProfileInfo({ setIsEditState }) {
    const { authInfoState } = useContext(AuthContext);
    const handleEdit = () => {
        setIsEditState(true);
    };
    return (
        <div
            className=" lg:w-[70%] lg:h-full
            sm:w-[70%] sm:h-full
            w-[70%] h-full 
            flex flex-col space-y-2 justify-around "
        >
            <UsernameDisplay text={authInfoState.profile?.username} />
            <BioDisplay text={authInfoState.profile?.bio} />
            <UserDetailsDisplay posts={0} friends={4} />
            <div className="justify-evenly flex sm:text-base text-sm ">
                <FormLink onClick={(e) => handleEdit()}>Edit profile</FormLink>
            </div>
        </div>
    );
}
