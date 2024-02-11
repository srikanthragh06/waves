import React, { useContext, useState } from "react";
import MainPage from "../../components/MainPage";
import PurpleFileUploader from "../../components/PurpleFileUploader";
import FormInput from "../authPage/FormInput";
import PurpleButton from "../../components/PurpleButton";
import { getAuthToken } from "../../utils/token";
import { createPostApi } from "../../api/post";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";

export default function AddPost() {
    const navigate = useNavigate();
    const { userDetailsState } = useContext(AuthContext);

    const [postContentTextState, setPostContentTextState] = useState("");
    const [mediaState, setMediaState] = useState({
        media: null,
        isPending: false,
        error: "",
    });

    const [formStatusState, setFormStatusState] = useState({
        isPending: false,
        error: "",
    });

    const handleFileTypeError = () => {
        setMediaState((prev) => {
            return { ...prev, error: "Incorrect file type" };
        });
    };

    const handleUploaderChange = async (file) => {
        setMediaState({ media: file, isPending: false, error: "" });
    };

    const handleRemoveMedia = async (e) => {
        setMediaState({ media: null, isPending: false, error: "" });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (postContentTextState === "") {
            return setFormStatusState((prev) => {
                return { ...prev, error: "Content cannot be empty!" };
            });
        }

        setFormStatusState((prev) => {
            return { ...prev, isPending: true };
        });

        const formData = new FormData();
        if (mediaState.media) {
            formData.append("media", mediaState.media);
        }
        formData.append("content", postContentTextState);

        const token = getAuthToken();
        const res = await createPostApi(token, formData);
        if (res.data.error) {
            return setFormStatusState({
                isPending: false,
                error: "Could not upload post",
            });
        }

        setFormStatusState({
            isPending: false,
            error: "",
        });

        return navigate(`/profile/${userDetailsState.id}`);
    };

    return (
        <MainPage className={"border- pt-4"}>
            <div
                className="w-full
            lg:max-w-[800px] 
            sm:max-w-[500px] 
            sm:py-2
            flex flex-col space-y-10
            border- "
            >
                <div className="flex flex-col space-y-2 bg-color4 px-2 py-3">
                    <div
                        className="w-full
                                    lg:max-w-[800px] 
                                    sm:max-w-[500px] h-[400px]
                                    lg:max-h-[800px] 
                                    sm:max-h-[500px] 
                                    flex justify-center items-center"
                        style={
                            !mediaState.media
                                ? { border: "2px dashed gray" }
                                : {}
                        }
                    >
                        {!mediaState.media ? (
                            <p className="opacity-50">
                                Uploaded image or video
                            </p>
                        ) : mediaState.media.type.startsWith("image") ? (
                            <img
                                src={URL.createObjectURL(mediaState.media)}
                                alt="Uploaded media"
                                className="max-w-full max-h-full"
                            />
                        ) : mediaState.media.type.startsWith("video") ? (
                            <video
                                controls
                                controlsList="nodownload"
                                src={URL.createObjectURL(mediaState.media)}
                                className="max-w-full max-h-full"
                            />
                        ) : (
                            <p>Unsupported media type</p>
                        )}
                    </div>
                    <p className="text-red-600">{mediaState.error}</p>
                    <div className="flex w-full justify-around">
                        <PurpleFileUploader
                            onTypeError={handleFileTypeError}
                            handleChange={handleUploaderChange}
                            loadingState={mediaState.isPending}
                            className={``}
                            text={"Upload Media"}
                            types={["jpeg", "png", "jpg", "avi", "mp4", "mkv"]}
                        />
                        <PurpleButton
                            className={"text-base"}
                            onClick={handleRemoveMedia}
                        >
                            Remove Media
                        </PurpleButton>
                    </div>
                </div>
                <form
                    className="flex flex-col space-y-2 bg-color4 px-2 py-3"
                    onSubmit={handleFormSubmit}
                >
                    <FormInput
                        inputState={postContentTextState}
                        setInputState={setPostContentTextState}
                        inputType="textarea"
                        placeholder={`What are you thinking about?`}
                        rows={3}
                        className={"md:w-full"}
                    />
                    <p className="text-red-600">{formStatusState.error}</p>
                    <PurpleButton
                        className={"text-lg"}
                        loadingState={formStatusState.isPending}
                    >
                        Create Post
                    </PurpleButton>
                </form>
            </div>
        </MainPage>
    );
}
