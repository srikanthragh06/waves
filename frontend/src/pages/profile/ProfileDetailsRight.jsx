import { useContext, useEffect, useState } from "react";
import { getProfileDetailsApi } from "../../api/user";
import { useNavigate, useParams } from "react-router-dom";
import { formatDate, formatNumber } from "../../utils/utils";
import { AuthContext } from "../../context/AuthProvider";
import FollowButton from "../../components/FollowButton";
import EditProfileButton from "./EditProfileButton";
import MessageButton from "../../components/MessageButton";

export default function ProfileDetailsRight() {
    const navigate = useNavigate();
    const { userDetailsState } = useContext(AuthContext);

    const [profileDetailsState, setProfileDetailsState] = useState({});

    const { userId: profileId } = useParams();

    const setProfileDetails = async (profileId) => {
        const res = await getProfileDetailsApi(profileId);
        if (!res?.data?.error) {
            setProfileDetailsState((prev) => {
                return { ...prev, ...res?.data?.user };
            });
        }
    };

    useEffect(() => {
        if (profileId) setProfileDetails(profileId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profileId]);

    return (
        <div
            className="border-yellow-900 w-[70%] h-full
                        flex flex-col items-center space-y-4
                        border-"
        >
            <div className="sm:text-2xl lg:text-3xl text-xl">
                {profileDetailsState?.username}
            </div>
            <div className="text-color1 text-[13px] sm:text-[16px]">
                Born on {formatDate(profileDetailsState?.dateOfBirth)}
            </div>
            <div
                className={`sm:text-lg sm:text-left text-[14px] `}
                style={{ whiteSpace: "pre-line", textAlign: "center" }}
            >
                {profileDetailsState?.bio}
            </div>
            <div
                className="w-full flex justify-around
                            sm:text-xl text-[14px]
                            border-"
            >
                <span className="text-center cursor-auto">
                    {formatNumber(profileDetailsState?.posts)} posts
                </span>
                <span
                    className="text-center cursor-pointer"
                    onClick={() => navigate(`/following/${profileId}`)}
                >
                    {formatNumber(profileDetailsState?.followers)} followers
                </span>
                <span
                    className="text-center cursor-pointer"
                    onClick={() => navigate(`/following/${profileId}`)}
                >
                    {formatNumber(profileDetailsState?.following)} following
                </span>
            </div>
            {userDetailsState?.id !== parseInt(profileId) ? (
                <div className="flex w-full justify-evenly mt-3 border-">
                    <FollowButton profileId={profileId} />
                    <MessageButton
                        profileId={profileId}
                        className={"sm:w-1/4 text-[12px] sm:text-[16px]"}
                    />
                </div>
            ) : (
                <EditProfileButton />
            )}
        </div>
    );
}
