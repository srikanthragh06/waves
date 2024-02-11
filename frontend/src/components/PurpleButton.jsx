import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function PurpleButton({
    children,
    className,
    loadingState,
    style,
    onClick = () => {},
}) {
    return (
        <button
            onClick={onClick}
            style={style}
            className={`text-2xl px-2 py-1 bg-color2 rounded-sm 
            flex justify-center
            hover:opacity-65 border- ${className}`}
        >
            {loadingState ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
            ) : (
                children
            )}
        </button>
    );
}
