import { formatTimestamp, usernamifyContent } from "../../../utils/utils";

export default function PostMessageFooter({ postId, content, postedTime }) {
    return (
        <footer
            className="w-full border-color4 border-2 border-t-none p-1 cursor-pointer"
            onClick={() => window.open(`/post/${postId}`, "_blank")}
        >
            <div className=" border-b-  border-color4 px-3 py-2 w-full sm:text-base text-sm break-words ">
                <span style={{ whiteSpace: "pre-line", textAlign: "center" }}>
                    {usernamifyContent(content)}
                </span>
                <p className="text-[12px] text-right w-full m-1 border-">
                    {formatTimestamp(postedTime)}
                </p>
            </div>
        </footer>
    );
}
